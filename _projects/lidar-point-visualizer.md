---
layout: page
title: LiDAR Point Visualizer & Processor
description: Point cloud processing for object detection in autonomous racing.
img: assets/img/lidar_ransac.png
importance: 3
category: PoliMOVE-MSU
giscus_comments: true
---

### Collaborators

**Dr. Pragyan Dahal**, **Ben Toaz**, **Mk Bashar**

### Project Summary

To support training of the **PointPillars** opponent-car detector for the Indy Autonomous Challenge (IAC), accurate 3D ground-truth bounding boxes were required. The opponent GNSS-based odometry available in the [RACECAR dataset](https://github.com/linklab-uva/RACECAR_DATA) had non-trivial inaccuracies — particularly on the Z-axis, but also on X–Y and yaw — which left a large fraction of frames unusable for supervised training. This project built an **offline ground-truth refinement pipeline** that fuses ego-vehicle LiDAR with opponent GNSS to produce high-confidence, time-aligned labels.

This work was carried out as my **ECE 434 final project** (Group 10) with [Ben Toaz](https://github.com/btoaz) and Mk Bashar.

> 🔗 **Code:** [roboticvedant/lidar_ransac_visualize](https://github.com/roboticvedant/lidar_ransac_visualize)

## Problem

PointPillars and similar 3D detectors are only as good as their bounding-box labels. In the RACECAR dataset, opponent labels driven directly by GNSS frequently sit **below the road plane** or are misaligned in X–Y and yaw, often by enough that the bounding box doesn't fully enclose the LiDAR points belonging to the opponent car. Without correction, those frames are effectively garbage-in, garbage-out for any model trained on them.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar-ransac/Slide2.jpg" title="Problem statement — GNSS inaccuracies" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## Approach

The refinement runs as a four-stage pipeline:

1. **GNSS data** — Take the raw opponent odometry from RACECAR as the initial bounding-box guess.
2. **RANSAC ground-plane refinement** — Fit the local road plane and snap the bounding box vertically to it ("the car must be on the road").
3. **ICP refinement** — Match the LiDAR points inside the (now Z-corrected) bounding box against a pre-built **template point cloud of the opponent car** to refine X–Y position.
4. **RANSAC post-processing** — Re-run plane segmentation on the now-cleaner data to lock in the ground plane without contamination from car points.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar-ransac/Slide3.jpg" title="Refinement pipeline" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

### Dataset

We used the **RACECAR — High-Speed Autonomous Racing** dataset (Kulkarni et al., IROS 2023): time-aligned LiDAR point clouds, multi-camera imagery, and ego/opponent GNSS odometry from full-speed IAC sessions. All numbers below come from **Scene 6** of that dataset, which contains roughly 3 000 LiDAR frames with opponent labels.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar-ransac/Slide4.jpg" title="RACECAR dataset — multi-camera + LiDAR" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

### Stage 1 — Naive RANSAC Plane Refinement

A predefined region of interest is constructed around the GNSS bounding box, sized using the known dimensions of the opponent IAC car so that it captures both the vehicle points and a strip of the surrounding road. **3D RANSAC** fits the dominant plane in that ROI, and the bounding box's Z is then translated so the bottom of the box sits exactly on the fitted plane. Implementation is in raw Python on top of **Open3D**.

This fixes the dominant Z-axis error cheaply, but leaves residual X–Y misalignment.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar-ransac/Slide5.jpg" title="RANSAC ground-plane refinement" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Red = original GNSS bounding box (sitting below the road). Blue = corrected bounding box snapped onto the RANSAC-fit road plane (green).
</div>

### Stage 2 — ICP Refinement Against a Custom Car Template

We know what the opponent car looks like — its geometry doesn't change frame to frame — so the refined position can be improved by aligning the in-ROI LiDAR points to a **template point cloud** of the IAC chassis. The template was built by generating a 3D mesh of the car with **Meshy.ai** from IAC reference photos, then sampling it into a point cloud.

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar-ransac/Slide6.jpg" title="Custom opponent-car template point cloud" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

ICP is initialized with the RANSAC-refined pose as its starting guess, which keeps it well inside the convergence basin. We restricted ICP to **translation-only** updates: the LiDAR returns from a high-speed opponent are sparse and asymmetrically occluded, so full 6-DOF ICP can latch onto bad yaw rotations even when translation is correct. Yaw is left to be cleaned up later by the downstream **temporal tracker**, which has access to multi-frame context that single-shot ICP doesn't.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar-ransac/Slide7.jpg" title="Translation-only ICP result" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

### Stage 3 — RANSAC Post-Processing

After ICP, the boundary between car points and road points is much cleaner, so re-running ground-plane RANSAC on the post-ICP data produces a noticeably more reliable plane fit. In some original frames RANSAC was being polluted by car-body points and tilting the inferred ground plane; the post-ICP pass largely removes that failure mode.

## ROS 2 Integration

The pipeline was wrapped as a ROS 2 node — `live_visualizer_node` — to make it usable inside the existing PoliMOVE-MSU stack rather than only as an offline batch tool. The node subscribes to ego LiDAR + ego/opponent odometry, runs the RANSAC + ICP chain, and republishes corrected opponent odometry alongside Open3D-based visualization for live debugging.

## Results — Scene 6

The honest benchmarking story for ground-truth refinement is hard, because there is no separate "true" ground truth to score against. We did a frame-by-frame **visual inspection** pass on Scene 6 (~3 000 LiDAR frames) at each stage and counted frames usable as training labels:

| Stage | Usable frames | Notes |
|---|---|---|
| Raw GNSS labels | **412** | Severe Z-axis error and X–Y/yaw drift in most frames |
| + Naive RANSAC (Z-fix) | **2 089** | Z snapping alone recovers ~5× more frames |
| + ICP refinement | **~2 832** | Translation-only ICP failed to improve the bounding box on only **28 / 500** sampled frames (5.6%) |

So the pipeline takes Scene 6 from ~14% usable to ~95% usable — a meaningful change in the size of the trainable subset.

## Broader Application

The same construction is reusable as a **sensor-fusion refinement** layer for any system whose object detector outputs probabilistic / uncertain pose estimates: feed the detector output in as the initial guess and let the LiDAR-anchored RANSAC + ICP stage tighten it up. It is not a real-time component as written — Open3D + naive Python is offline-grade — but the algorithmic structure is the same as what you'd want online.

## Future Work

- **Learning-based registration** — Vanilla ICP is brittle to occlusions and geometry changes. Approaches like **PointNetLK** (Aoki et al., CVPR 2019) use a PointNet-style global descriptor inside a Lucas–Kanade-style update, which handles occlusions and partial matches better than nearest-neighbor ICP.
- **Camera + radar fusion** — Adding camera-based detection + radar Doppler to the refinement loop would help disambiguate yaw and resolve cases where LiDAR alone is degenerate (e.g., long-axis-aligned views of the opponent).
- **Real-time deployment** — The current pipeline is offline-grade. Pushing it into the live perception stack would require a C++ port and tighter integration with the existing IAC software stack.
- **Generalizable ground truth** — The biggest remaining problem is that "ground truth" itself is still constructed by visual inspection. Even a refined dataset is only as solid as the inspector calling it usable.

## References

1. Kulkarni et al., *RACECAR — The Dataset for High-Speed Autonomous Racing*, IROS 2023.
2. Lang et al., *PointPillars: Fast Encoders for Object Detection from Point Clouds*, CVPR 2019.
3. Aoki et al., *PointNetLK: Robust & Efficient Point Cloud Registration Using PointNet*, CVPR 2019.
4. Jin et al., *Robust LiDAR-Based Vehicle Detection for On-Road Autonomous Driving*, Remote Sensing 15(12), 2023.
