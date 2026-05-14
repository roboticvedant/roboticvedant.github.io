---
layout: page
title: Autonomous Blimp Robot
description: From hardware to high-fidelity simulation — design, modeling, and control of an autonomous indoor blimp platform.
img: assets/img/blimp/blimp_robot.jpg
importance: 1
category: Smart Microsystems Lab
related_publications: true
giscus_comments: true
---

### Project Overview

The **Autonomous Blimp Robot** project at the Smart Microsystems Lab is an end-to-end effort on an indoor lighter-than-air platform — low-noise, safe around people, and well-suited to long-duration sensing and control research. Unlike multirotors, which give minutes of flight, a blimp gives **hours**, which opens up applications like agricultural monitoring, environmental surveillance, and wildlife observation that benefit from extended on-station time.

The work spans hardware bring-up, full 6-DOF nonlinear dynamics derivation, a physics-based simulator, controller experiments (PI → PID → feedforward → disturbance-observer-based), ROS 2 firmware integration, and a next-generation hardware platform now in design.

**Highlights:**

- 🛠️ **Hardware** — Modular blimp platform with vectored thrust and onboard sensing.
- 🤖 **ROS 2 Stack** — micro-ROS firmware on the gondola and a ROS 2 host stack for teleop, kinematic estimation, dead reckoning, and flight control.
- 🧠 **Dynamics & Simulation** — 6-DOF nonlinear model derived via Euler–Lagrange formalism, implemented in a Simulink-based simulator for in-silico controller validation.
- 🎯 **Control** — Successive controllers from single-axis PI all the way through multi-axis PID with trajectory tracking and an extended high-gain observer (EHGO) for disturbance rejection.

## Current Platform

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/blimp_robot.jpg" title="Blimp robot v1" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/blimp_control_board_v1.png" title="Blimp gondola control board v1" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: the current v1 blimp robot with helium envelope and gondola. Right: v1 gondola control board running the micro-ROS firmware that bridges the platform onto the ROS 2 host stack.
</div>

## Buoyancy Tuning _(proposed — not yet implemented)_

One concept I've been sketching out — but haven't built — is a **tunable air bladder** inside the helium envelope to set static lift. The envelope volume would stay fixed; the bladder pulls in ambient air (≈ 70 % N₂, much heavier than helium) to displace helium and increase the system's effective weight without changing the displaced volume. Small bladder → lighter blimp; large bladder → heavier blimp. The motivation is to trim the platform to **near-neutral buoyancy** before any controller is engaged, since the actuators are weak relative to the envelope's volumetric drag and any lift mismatch eats into already-thin control authority. Today, trim is done manually with ballast.

## Dynamics & Modeling

The full 6-DOF dynamics were derived in Euler–Lagrange form:

$$M(q)\ddot{q} + C(q,\dot{q}) + g(q) = \tau(u) + \sigma_{\text{dist}}$$

with $$q = [x, y, z, \phi, \theta, \psi]^\top$$ and $$\tau(u)$$ collecting the thruster forces and moments. A planar simplification — body-frame thrust $$f$$ along $$x_b$$ and a yaw moment $$M$$ — was used heavily for controller derivation and for the disturbance-observer work. The non-holonomic structure of that planar model (the platform can rotate and translate forward but not slide sideways without rotating first) drives the choice of unicycle-style trajectory tracking later in the project.

## Simulation Environment

A Simulink simulator wraps the full state equations, applies thruster commands, and visualizes the blimp in a 3-D environment. All controller iterations below were validated in this simulator before any consideration of hardware deployment, with reference trajectories and injected disturbances toggleable from a dashboard.

## Controller Progression

Rather than jump straight to a multi-axis controller, the design ramped up in stages, each one exposing the limitation that motivated the next.

### Stage 1 — Z-only PI Controller

A first pass used a single PI loop driving altitude $$z$$ against a square-wave reference (1.275 m – 2.975 m, 320 s period). The altitude tracking looked clean on its own, but driving only $$z$$ **non-trivially perturbed** $$x$$ and yaw — the thrusters that change height also push the platform laterally because of how they're mounted. A Z-only controller can't be the final answer.

### Stage 2 — PID on X – Z – Roll – Yaw

Next iteration: compute the position error in the world frame $$\Sigma_0$$, **rotate the error vector into the body frame $$\Sigma_b$$**, and use the body-frame error as input to per-axis PID controllers driving the thrusters. The same square-wave $$z$$ reference was used, with constant zero references on $$x$$, roll, and yaw to actively suppress the cross-coupling that bit Stage 1.

This was a meaningful improvement — $$z$$ tracks well and roll/yaw stay quiet — but **uncontrolled states still drift**. In particular $$y$$ slowly walked off because nothing was actively regulating it.

### Stage 3 — Planar Trajectory Tracking (Unicycle + PID)

Treating the blimp as a unicycle in the $$xy$$ plane with body-frame forward thrust + yaw moment let the controller actually track planar trajectories at constant $$z$$. Circular references at $$R = 2$$ m and $$R = 1.5$$ m converged, but **settling time was ~350 s** — fine for benchmarking, slow for any real mission. Approach #3 (feedforward + two-loop structure) bounded the response cleanly but left the slow settling untouched.

### Stage 4 — Disturbance Observer (EHGO)

The final stage added an **Extended High-Gain Observer** to estimate and cancel persistent disturbances on the planar dynamics. The observer is built around the standard chain-of-integrators form for $$x$$, $$y$$, and $$\theta$$:

$$
\dot{\hat{x}}_2 = \frac{\tau(u) - g(q) - C(q,\dot{q})}{M(q)} + \hat{\sigma}_d + \frac{\alpha_2}{\varepsilon^2}(y - \hat{x}_1)
$$

with the disturbance estimate $$\hat{\sigma}_d$$ fed back into the control law.

Two disturbance profiles were tested:

- **Disturbance #1** — small constant offsets injected on $$\ddot{x}$$ and $$\ddot{y}$$ (≈ 2 × 10⁻³ each).
- **Disturbance #2** — offset only on $$\ddot{y}$$ — asymmetric, harder for an integral-only controller to compensate symmetrically.
- **Larger injected disturbance** — $$d = [0.4,\, -0.3,\, 0.25]^\top$$ on $$\ddot{x}$$, $$\ddot{y}$$, $$\ddot{\theta}$$ to stress the observer.

Findings:

- Against the original PID with strong **integral action**, EHGO didn't move the needle much — the integrator was already absorbing slow drift, so the observer had little left to do.
- Against a controller with **integral action removed**, EHGO meaningfully reduced steady-state error, confirming the observer is doing real work and not just being masked by the integrator.
- Under the larger 3-axis disturbance, the EHGO-augmented controller kept the planar trajectory bounded while the un-rejected version drifted off the reference circle.
- Pathological case: when yaw tracking is **fast enough** but the underlying trajectory geometry is bad, the planar trajectory diverges into a flower pattern even though yaw and observer estimates each look fine in isolation — a useful reminder that per-axis health doesn't imply trajectory health.

The takeaway is that EHGO is the right tool when integral action is unavailable or undesirable (e.g. for windup-sensitive cases), but for the current platform with a forgiving integrator the marginal benefit is small.

## Honors Option Deep Dive — ECE 417 (Dr. Vaibhav Srivastava)

The EHGO trajectory-tracking work was formalized as my **ECE 417 Honors Option** project under Dr. Vaibhav Srivastava, with a self-contained simulation study and write-up. This section captures the cleaner derivation behind Stage 4.

> 📄 **Full report:** [ECE 417 Honors Option — Blimp EHGO Trajectory Tracking (PDF)](/assets/pdf/ece417_hoption.pdf)

### Decoupling Argument

The platform has 4 thrusters: 2 control roll and $$\hat{z}_b$$, the other 2 control $$\hat{x}_b$$ and yaw. Roll and pitch are **naturally stable** because the gondola hangs well below the center of buoyancy — so $$\hat{z}_b$$ stays nearly aligned with $$\hat{z}_0$$, and the altitude pair of thrusters effectively commands inertial $$z^0$$ on its own. This lets the 6-DOF problem cleanly decompose into an altitude loop + a planar 3-DOF problem. Decomposing also drops gravity and buoyancy out of the planar dynamics; everything that's left of the unmodeled aerodynamics gets lumped into a disturbance term $$\delta$$ for the observer to estimate.

### Planar Unicycle-like Model

$$
\begin{bmatrix}\ddot{x}\\\ddot{y}\\\ddot{\theta}\end{bmatrix} =
\begin{bmatrix}f\cos\theta + \delta_x\\ f\sin\theta + \delta_y\\ M + \delta_\theta\end{bmatrix}
$$

The robot commands a body-frame longitudinal force $$f$$ and a yaw moment $$M$$. Since $$f$$ can't be split independently into world-frame $$x$$ and $$y$$, the position controller has to **simultaneously solve for $$f$$ and the desired heading $$\theta_d$$**.

<div class="row justify-content-sm-center">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/blimp_anim.png" title="Assumed form of the blimp robotic platform" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/robot_unicycleDyn.png" title="Unicycle-like planar model" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: assumed form of the blimp — gondola hangs below the envelope so roll/pitch are passively stable. Right: planar unicycle-like model with body-frame longitudinal force $$f$$ and yaw moment $$M$$.
</div>

### Position Controller

With disturbance estimates $$\hat{\delta}_x$$, $$\hat{\delta}_y$$ from the observer, the position controller is:

$$
\begin{bmatrix}f\cos\theta\\ f\sin\theta\end{bmatrix} =
\begin{bmatrix}\ddot{x}_d + K_p(x_d - \hat{x}) + K_d(\dot{x}_d - \dot{\hat{x}}) - \hat{\delta}_x\\ \ddot{y}_d + K_p(y_d - \hat{y}) + K_d(\dot{y}_d - \dot{\hat{y}}) - \hat{\delta}_y\end{bmatrix}
$$

The required force magnitude and heading reference fall out as:

$$
f = \sqrt{(f\cos\theta)^2 + (f\sin\theta)^2}, \qquad
\theta_d = \mathrm{atan2}(f\sin\theta,\; f\cos\theta)
$$

### Yaw Controller

The yaw loop uses the $$\sin$$-of-error form to avoid wraparound at $$\pm\pi$$:

$$
M = K_p \sin(\theta_d - \hat{\theta}) - K_d\,\dot{\hat{\theta}} - \hat{\delta}_\theta
$$

### Observer

Three independent EHGO chains, one per output ($$x$$, $$y$$, $$\theta$$). For the $$x$$-chain:

$$
\begin{bmatrix}\dot{\hat{X}}_1\\\dot{\hat{X}}_2\\\dot{\hat{\delta}}_x\end{bmatrix} =
\begin{bmatrix}\hat{X}_2 + (\alpha_1/\varepsilon)(Y_1 - X_1)\\ \hat{\delta}_x + f\cos\theta + (\alpha_2/\varepsilon^2)(Y_1 - X_1)\\ (\alpha_3/\varepsilon^3)(Y_1 - X_1)\end{bmatrix}
$$

— and analogously for $$y$$ (with $$f\sin\theta$$ as the input) and $$\theta$$ (with $$M$$). Only the position-level outputs are assumed measurable; velocities and the disturbance state are estimated.

### Simulation Setup

| Parameter            | Value                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Reference            | $$[x_d, y_d] = 1.5\,[\cos(0.5t),\, \sin(0.5t)]$$ — a 1.5 m circle, 60 s period                    |
| Injected disturbance | $$[\delta_x, \delta_y, \delta_\theta] = [0.4,\,-0.3,\,0.25]$$ (constant, unknown to the observer) |
| Mass / inertia       | 0.148 kg / 0.004 kg·m²                                                                            |
| Translation PD       | $$K_p = 1$$, $$K_d = 1.5$$                                                                        |
| Yaw PD               | $$K_{p,\theta} = 12$$, $$K_{d,\theta} = 4$$                                                       |
| EHGO gains           | $$L = [3,\,3,\,1]$$, $$\varepsilon = 0.1$$                                                        |
| Saturation           | translation 0.25 m/s², yaw 5 rad/s²                                                               |
| Integration          | Forward Euler, $$dt = 1$$ ms, 5 reference periods                                                 |

Implementation is a single MATLAB script that simulates the planar plant, runs three independent `ehgo_step` Euler updates per tick, and feeds estimates back into the controller. A 6-DOF Simulink + Unreal Engine 5.3 visualizer is used for the full-3D version of the same setup.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/unrealengine.png" title="Unreal Engine 5.3 simulation visualizer" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Simulink + Unreal Engine 5.3 visualizer used for the full 6-DOF version of the simulation environment.
</div>

### Result

With the same controller and the same constant disturbance, **EHGO-on** converges cleanly onto the 1.5 m circle, while **EHGO-off** drifts off the reference and never closes the loop on the steady-state offset.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/traj-dist-no-rej.png" title="Trajectory tracking — no disturbance rejection" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/dist-rej-traj.png" title="Trajectory tracking — with EHGO disturbance rejection" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: planar trajectory under the constant $$[0.4,\,-0.3,\,0.25]$$ disturbance with EHGO disabled — trajectory drifts off the reference circle. Right: same disturbance, EHGO enabled — trajectory locks onto the 1.5 m reference.
</div>

The estimated disturbances $$\hat{\delta}_x, \hat{\delta}_y, \hat{\delta}_\theta$$ converge to the injected values within a small fraction of one orbital period, validating both the observer design and the choice of $$\varepsilon$$.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blimp/dist-est.png" title="Estimated disturbances vs. injected truth" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  EHGO disturbance estimates (colored) tracking the true injected disturbance (dashed) on each axis: $$d_x = 0.4$$, $$d_y = -0.3$$, $$d_\theta = 0.25$$.
</div>

### References

- Boss & Srivastava, _J. Dyn. Syst. Meas. Control_ 147(1), 2025 — high-gain observer for multirotor trajectory estimation/tracking (the structural template adapted here).
- Khalil, _IEEE Control Systems Magazine_ 37(3), 2017 — high-gain observers in feedback control, with the chain-of-integrators recipe used for `ehgo_step`.
- Cheng et al., _IEEE RA-L_, 2023 — RGBlimp design/modeling/aerodynamics, used as the rigid-body dynamics reference.

## ROS 2 Firmware & Stack

The on-vehicle firmware ([blimp-controller](https://github.com/roboticvedant/blimp-controller)) talks to the host over **micro-ROS**, exposing the gondola as a first-class ROS 2 node. The host-side package — [blimp_ros2_nodes](https://github.com/roboticvedant/blimp_ros2_nodes), tested on ROS 2 Humble — provides:

- `joystick_control` — PS4 controller integration via `teleop_twist_joy`, mapping joystick input to body-frame velocity commands.
- `flight_controller` — flight-control nodes including yaw regulation.
- `KinematicEstimation` — kinematic state estimation, dead reckoning, and low-pass filtering used as a shared dependency by the other packages.

This split keeps the high-rate, deterministic control loops on the MCU while letting estimation and high-level planning live on the host, where they can use ROS 2 visualization and tooling without compromising real-time guarantees on the vehicle.

## Next-Generation Hardware Platform

The current gondola has clear ceilings: open-loop coreless brushed motors, a resource-constrained MCU, no rotor-speed feedback, no camera, and no real provision for outdoor operation. The next-gen design addresses these head-on.

### What's Changing

- **Compute split** — A Raspberry Pi CM4 SBC for high-level autonomy (vision, planning, ROS 2 graph) alongside a **Teensy 4.0** as the hard-real-time master MCU for low-level control and safety. The split lets the SBC be killed/restarted without dropping flight control.
- **Closed-loop propulsion** — Three dedicated **BLDC driver ASICs** with rotor-speed feedback, replacing open-loop drive of brushed motors.
- **Actuator upgrade** — From 3.7 V coreless brushed (60 000 RPM, 40 mA) to **Happymodel EX1102** brushless on 2–3S with multiple KV options, much more thrust headroom for outdoor wind tolerance.
- **Sensing** — IMU, GNSS, **two ToF sensors**, and a CSI camera. The IMU + GNSS handle global pose; ToF gives short-range obstacle awareness; the camera enables vision-based docking and downstream perception.
- **Comms** — LoRa for long-range telemetry/command, in addition to existing Wi-Fi for high-bandwidth data.
- **Power** — 2S LiPo (7.4 V) → 20 A fuse → INA226 power monitor (3 mΩ shunt) → **MAX20008AFOC** buck → 5 V rail. The SBC sits behind a **TPS22963C** load switch that the MCU can gate, so the SBC can be brought up or shut down independently of flight control.
- **Form factor / config** — Board grows from 71 × 54 mm (40 cm²) to 68.5 × 74 mm (51 cm²); HW mass goes from 80 g to ≈ 155 g, which pushes the envelope to either a larger single balloon or a 2-balloon configuration. Thruster count drops from **4 to 3** (yaw, longitudinal, height) — fewer actuators but each one is much more capable.

### Platform Versatility

The new compute board is designed to be more than just a blimp avionics module. With pogo-pin connectors carrying both power and data, the same board can dock onto **different external sensing payloads** (or different robotic platforms entirely), so the autonomy stack is reusable across experiments rather than blimp-specific.

## Docking & Recharging Concepts

A blimp that flies for hours still needs to come home and recharge. Two docking concepts are on the table:

- **Dock-only (no tether).** The ground station has an **electromagnet** that pulls the gondola into the vicinity and roughly orients it; a wireless charging pad on top of the station doubles as a **twist-and-snap physical lock**. Magnetometer + onboard camera handle the final approach, since when the dock is directly below the blimp it falls out of the camera FOV and the magnetometer takes over.
- **Dock + tether.** Same locking pad and electromagnet, but with a powered tether between station and gondola so the platform can stay airborne indefinitely off shore power for persistent-monitoring missions.

## Status & Next Steps

- Migrating firmware and ROS 2 nodes onto the next-gen avionics board.
- Closing the loop on the new BLDC propulsion stack with rotor-speed feedback.
- Bringing up vision-based docking against the wireless-pad ground station.
- Continuing controller work toward outdoor deployment, where the EHGO-style disturbance rejection actually has wind to compensate for.

<style>
.caption {
  font-size: 0.95rem;
  color: #555;
  margin-top: 0.5rem;
  text-align: center;
}
</style>
