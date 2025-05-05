---
layout: page
title: Proprioceptive Soft Robot Sensor Modelling
description: Compensation of nonlinear sensor dynamics in soft robotic actuators.
img: /assets/img/soft_robot.png
importance: 3
category: Smart Microsystems Lab
giscus_comments: true
---

### Principal Investigator  
**Dr. Xiaobo Tan**  

### Collaborator  
**Preston Fairchild**

### Project Summary  
This project tackles a fundamental challenge in soft robotics — the nonlinear and time-dependent response of stretchable strain sensors. We developed a lightweight compensation model using **Time Delay Neural Networks (TDNNs)** to correct for **hysteresis and dynamic lag** in conductive rubber-based sensors.

The approach was applied to a soft continuum manipulator, enabling real-time **proprioceptive sensing** with high spatial accuracy. The compensated output achieved a **mean tip position error under 4%** of the manipulator’s total length — demonstrating strong promise for closed-loop control applications.

---

### Publication  
📄 *Naik, V.K., Fairchild, P.R. and Tan, X., 2025.*  
**"Nonlinear compensation of stretchable strain sensors with application to proprioceptive sensing of soft robotic arm."**  
*Smart Materials and Structures, IOP Publishing.*  
[Read the full paper →](https://iopscience.iop.org/article/10.1088/1361-665X/adb2c7)

---

<div class="row justify-content-sm-center">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/soft_robot.png" title="Soft Robotic Manipulator with Integrated Sensor" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/publication_preview/tip-position-soft-robot.gif" title="Predicted vs Ground Truth Sensor Output Using TDNN" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

<div class="caption">
  Left: Soft arm prototype with embedded stretchable sensor. Right: TDNN-based compensation showing high-fidelity reconstruction of joint motion.
</div>

