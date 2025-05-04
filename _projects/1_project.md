---
layout: page
title: Autonomous Blimp Robot
description: From hardware to high-fidelity simulation — design, modeling, and control of an autonomous indoor blimp platform.
img: assets/img/blimp_robot.png
importance: 1
category: Smart Microsystems Lab
related_publications: true
giscus_comments: true
---

### Principal Investigator  
**Dr. Xiaobo Tan**

### Project Overview  
The **Autonomous Blimp Robot** project at the Smart Microsystems Lab involves the development of a fully integrated indoor aerial platform. The blimp is designed to be low-noise, safe, and highly maneuverable — ideal for real-time control research and soft robotic exploration.

**Highlights of the project:**
- 🛠️ **Hardware Development**  
  Designed and manufactured a modular robotic blimp platform, equipped with vectored thrust actuation and onboard sensing.

- 🤖 **ROS2 Integration**  
  Developed the firmware to interface with micro-ros,and connect the blimp platform with **ROS2**, enabling real-time communication, visualization, and control. Making it modular to prototype and use high level control and localization stacks.

- 🧠 **Dynamics Modeling & Simulation**  
  Derived full **6DOF nonlinear dynamics** using Euler–Lagrange formalism and implemented a physics-based simulator to validate control algorithms in silico.

<!-- ---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp_hw_1.jpg" title="Blimp Hardware – Side View" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp_ros2.jpg" title="ROS2 Interface Visualization" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp_sim.png" title="Blimp Simulator in Action" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

<div class="caption">
  Left: Blimp prototype with vectoring thrusters. Center: ROS2 interface with live telemetry. Right: Custom 6DOF dynamics simulator.
</div>

--- -->

### Motivation  
Autonomous blimps present a compelling solution for long-duration aerial tasks in domains such as environmental monitoring and precision agriculture. Their inherently low-power, buoyancy-assisted design enables extended flight times, making them ideal for missions where coverage, persistence, and minimal disturbance are prioritized over agility.

They are particularly well-suited for:

> 🌾 Precision agriculture — monitoring crop health, irrigation zones, or soil conditions across large farmlands with minimal ground intervention.

> 🌍 Environmental sensing — collecting atmospheric, air quality, or thermal data over extended periods and wide geographic areas.

> 🔋 Energy-efficient aerial surveillance — performing long-term monitoring tasks with reduced actuation demands compared to rotorcraft.

> 🛰️ Autonomous navigation in GPS-degraded environments — such as under tree canopies, near tall crops, or in remote, signal-poor areas.

<!-- <div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/blimp_flight.jpg" title="Indoor Autonomous Flight Test" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/blimp_dynamics_diagram.png" title="Force and Moment Diagram" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

<div class="caption">
  Captured: Flight test inside the lab (left), and the dynamic model diagram used for controller design (right).
</div> -->

---

<!-- ### Additional Resources  
- 📄 View related publications below.  
- 💬 Leave your thoughts or questions in the comments section.  
- 🔧 Source code and simulator will be open-sourced soon on GitHub. -->

<!-- --- -->

<style>
.caption {
  font-size: 0.95rem;
  color: #555;
  margin-top: 0.5rem;
  text-align: center;
}
</style>
