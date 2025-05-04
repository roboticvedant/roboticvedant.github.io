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
To support the training of the **PointPillars** model for opponent car detection, accurate 3D ground truth was required. Since precise object labels were unavailable, a custom post-processing pipeline was developed to refine the rough bounding box estimates. This was achieved by **synchronizing ego-vehicle LiDAR point clouds** with **opponent GNSS localization data**, producing high-confidence, time-aligned labels.

---
<!-- 
<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar_overlay.png" title="Raw Point Cloud with Opponent Position Overlay" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar_bbox_fix.png" title="Bounding Box Refinement" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/lidar_result.png" title="Final Training Sample" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

<div class="caption">
  Left to right: Raw LiDAR overlay, refined bounding box using GNSS data, and final processed output for model training.
</div> -->
