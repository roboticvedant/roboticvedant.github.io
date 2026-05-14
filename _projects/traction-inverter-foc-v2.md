---
layout: page
title: Traction Inverter (FOC v2)
description: Second-generation SiC traction inverter for solar racing — improved power stage, control firmware, and system integration.
img: assets/img/LysanderInverter489/lysanderInverter3D_altium.jpg
importance: 2
category: Solar Car
giscus_comments: true
---

<div class="row justify-content-sm-center">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/msu_srt.png" title="MSU Solar Racing Team" class="img-fluid rounded" %}
  </div>
</div>

# Traction Inverter — FOC Inverter v2

**Collaborators:** Owen Winegar, Abdallah Daha, Dakota Farwell
**Advisor:** Dr. Omid Beik
**Course:** ECE 489 — Senior Design Capstone, Spring 2026

## Project Overview

The Traction Inverter is the second-generation Field Oriented Control (FOC) inverter developed for the MSU Solar Racing team's electric drivetrain. Building on the lessons learned from the first FOC prototype, this revision targets a production-grade SiC power stage, a refined low-voltage support architecture, and a control firmware stack that is robust enough for on-vehicle deployment.

The goal of v2 is to move from a benchtop prototype to a fully integrated traction inverter that can drive the vehicle's PMSM under real load conditions, with proper thermal management, fault handling, and safety guarantees.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/lysanderInverter3D_altium.jpg" title="Lysander Inverter — 3D Altium render" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  3D Altium render of the v2 traction inverter PCB ("Lysander").
</div>

## Team & Contributions

This is a four-person senior design effort, with each member leading a distinct subsystem of the inverter:

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/teamPic489FOC.jpg" title="ECE 489 traction inverter team" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  The ECE 489 traction inverter team — Vedant K. Naik, Owen Winegar, Abdallah Daha, and Dakota Farwell.
</div>

- **Vedant K. Naik** _(ECE — Senior)_ — Led system-level control and firmware development, including PMSM modeling, control-law derivation, simulation, and the fault/state-machine logic. Also contributed to sensing-hardware development and the overall safety philosophy.
- **Owen Winegar** _(ECE — Senior)_ — Led the SiC power-stage development, including the FET-related power stage and associated gate-drive hardware. Drove hardware bring-up and contributed to the hardware architecture.
- **Abdallah Daha** _(ECE — Senior)_ — Led the low-voltage power rails and the final layout/integration of the inverter subcircuits. Drove hardware assembly and bring-up.
- **Dakota Farwell** _(ECE — Senior)_ — Led the thermal design and simulation effort for the controller and housing, and led project operations including test coordination and component ordering.

## What's New vs. v1

The first FOC prototype (see [FOC Inverter Prototype](/projects/foc-inverter-prototype/)) validated the basic control concept on an FNA25060 IPM and an STM32 platform. v2 is a substantial rework rather than an incremental update:

- **SiC power stage** — Discrete SiC MOSFETs replace the IPM, enabling higher switching frequency, lower conduction losses, and a more compact thermal footprint.
- **Custom low-voltage rails** — Purpose-built LV supplies replace the prototype-grade bench supplies, supporting the gate drives, controller, and sensing chain.
- **Integrated mechanical/thermal design** — Controller and housing are co-designed with thermal simulation in the loop, rather than packaged after the fact.
- **Hardened firmware** — A formal fault and state-machine layer wraps the FOC control loop, with deterministic responses to over-current, over-temperature, and DC-link faults.

## System Architecture

The inverter is structured as a tightly-coupled stack of power, sensing, and control subsystems, with clear interfaces between them so each can be developed and tested in isolation before integration.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/SystemLevelDriveInverter.jpg" title="System-level architecture of the drive inverter" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  System-level block diagram of the drive inverter — power stage, low-voltage rails, sensing, and the controller domain.
</div>

## Control & Firmware

The control side of the project covers the full chain from machine model to deployed firmware:

1. **PMSM modeling** — dq-frame modeling of the motor, parameter characterization, and validation against bench data.
2. **Control derivation** — Current-loop and speed-loop design in the dq frame, with feed-forward decoupling and anti-windup.
3. **Simulation** — Closed-loop simulation of the PMSM + inverter + controller before any code lands on the target.
4. **Firmware** — STM32-based implementation of Clarke/Park transforms, SVPWM, current/speed PI loops, and the fault state machine.
5. **Sensing** — Phase-current and DC-link sensing front-ends, with attention to noise, isolation, and safe-state behavior.

> 📄 **Controls deep-dive:** for a more detailed walk-through of the modulation strategy and FOC derivation behind this inverter, see the companion talk: [Modulation & FOC notes (PDF)](/assets/pdf/modulation_foc.pdf).

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/high_level_control_flow_drive_inverter.jpg" title="High-level control flow of the drive inverter" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  High-level control flow — from sensed phase currents through the dq-frame loops to SVPWM gate commands.
</div>

## PMSM Characterization

Before any closed-loop control could be tuned, the Mitsuba in-wheel motor had to be characterized so the dq-frame model would actually reflect the real machine. Characterization was done in three passes — DC, AC, and back-EMF — with hall-sensor alignment as a prerequisite.

### Hall Sensor Identification

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/hall_id_mitsuba.jpg" title="Hall sensor identification — Mitsuba motor" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Hall sensor identification on the Mitsuba motor — used to align the rotor electrical angle for the dq transform.
</div>

### DC Characterization

Stator resistance was extracted from a DC V–I sweep across multiple sample groups to bound the spread between phases.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/DC_VI_curve.png" title="DC V–I curve" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/DC_test_sample_group_distribution.png" title="DC test sample group distribution" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: DC V–I curve used to estimate phase resistance. Right: distribution of sample groups across the DC test set.
</div>

### AC Characterization (60 Hz, Locked Rotor)

A locked-rotor 60 Hz AC test gave the inductance and impedance behavior of the windings, which feeds directly into the current-loop bandwidth design.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/AC_60hz_locked_rotor.png" title="AC 60 Hz locked-rotor test" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/AC_60hz_phase_visualization.png" title="AC 60 Hz phase visualization" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: locked-rotor AC test setup at 60 Hz. Right: phase visualization of the resulting waveforms.
</div>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/AC_60Hz_data_fft.png" title="FFT of AC 60 Hz data" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/AC_60hz_data_impedance_bode_spectrum.png" title="Impedance Bode spectrum from AC 60 Hz data" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: FFT of the AC test data. Right: extracted impedance Bode spectrum used to fit stator inductance.
</div>

### Back-EMF & Flux Linkage

Spinning the motor as a generator gave the back-EMF constant and rotor flux linkage — the last parameter needed to close out the dq model. A factor of ½ is applied because the windings were configured in series during characterization, so the reported flux linkage corresponds to the parallel-winding configuration used on the vehicle.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/BEMF_voltage_freq_comp.png" title="Back-EMF voltage vs. frequency" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/BEMF_flux_linkage.png" title="Back-EMF flux linkage" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: measured back-EMF voltage vs. electrical frequency. Right: derived rotor flux linkage.
</div>

### Extracted Parameters

| Parameter                     | Symbol   | Value                  |
| ----------------------------- | -------- | ---------------------- |
| Stator resistance (per phase) | $$R_s$$  | 193.47 mΩ              |
| Phase inductance              | $$L_s$$  | 0.44 mH                |
| Rotor flux linkage            | $$\psi$$ | 98.05 mWb (± 3.25 mWb) |
| Pole pairs                    | $$p$$    | 16                     |

These feed directly into the dq model used for control derivation, current-loop bandwidth design, and the torque–speed envelope simulation below.

## Simulation

With the characterized parameters in hand, the full PMSM + inverter + controller stack was simulated in MATLAB/Simulink to verify torque–speed behavior and tune the control loops before deployment to the target.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/torque_speed_matlab_sim.png" title="Torque–speed simulation in MATLAB" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Simulated torque–speed envelope of the closed-loop PMSM drive in MATLAB/Simulink.
</div>

## Power Stage & Hardware

On the hardware side, v2 moves to a SiC-based three-phase bridge with dedicated gate-drive circuitry, a custom LV power tree, and a layout that prioritizes commutation-loop inductance, thermal pathing, and serviceability. Bring-up is staged: LV rails first, then gate drives, then power stage under reduced DC-link voltage, then full-power operation.

### MOSFET Selection

We chose a 400 V Infineon SiC MOSFET. The pack maxes out around 113 V today, so 400 V leaves substantial headroom and keeps the door open to a higher-voltage bus on a future car (lower current → less I²R loss in the harness, inverter, and motor). Because the inverter switches at 20–30 kHz, conduction loss dominates over switching loss, so within Infineon's 400 V lineup we picked the lowest-$$R_{DS(on)}$$ part rather than the fastest one.

### Isolated High-Voltage Sensing

The sensing chain is built around automotive-qualified isolated front-ends so the LV controller domain stays galvanically separated from the traction bus.

- **Phase currents** — TI TMCS1133B1A-Q1 Hall-effect sensors, 25 mV/A, ±62 A range. Used for FOC current feedback and overcurrent protection.
- **DC-link current** — TMCS1133B7A-Q1, 20 mV/A, ±77.5 A range. Used for input-current monitoring, power estimation, and the hardware fail-safe path described below.
- **DC-link voltage** — Resistor divider into a TI AMC3311-Q1 reinforced isolated amplifier with integrated isolated DC/DC. Divider ratio $$k_{div} = 0.013485$$ using 0.1% / 25 ppm/°C thin-film resistors, giving a 0–148.3 V measurement range against the 65–150 V battery operating window.

Hall-effect sensing was preferred over shunts because of the isolation and the negligible insertion loss in the high-current path.

### Low-Voltage Power Rails

The LV input accepts a nominal 24 V from the car's auxiliary bus, with operation specified across 10–28 V to absorb sag, transients, and a possible future 12 V LV architecture. The front end provides reverse-polarity blocking, TVS clamping, and a CM choke + ferrite bead for differential HF attenuation.

- **Active protection** — TI LM74202-Q1 eFuse with UVLO ≈ 10.1 V, OVP ≈ 28.4 V, 1.2 A overload limit, and ~5 ms inrush ramp. Its fault output is wired to the MCU as an active-low flag so the firmware can disable switching deterministically before the eFuse latches off.
- **Cascaded buck + LDO** — A 2.2 MHz automotive synchronous buck generates a 3.8 V intermediate rail, which feeds two TPS7A9401-Q1 ultra-low-noise LDOs in current-share parallel for the 3.3 V controller rail.
- **Isolated gate-drive bias** — Six UCC14240-Q1 isolated DC/DC modules generate the six 18 V high-side / low-side gate-drive supplies referenced to each switching node.

This split keeps the controller's low-noise rail isolated from the gate-drive bias network.

### PCB Layout

The board is split into a digital/control side and an inverter power side to keep the noisy switching domain away from sensitive analog/digital signals. The three half-bridges are laid out as **vertical, mirror-symmetric phases** so each commutation loop sees the same parasitics, and gate drivers are placed immediately adjacent to their MOSFETs to minimize gate-loop inductance. **Via-in-pad** under each MOSFET pulls heat through the PCB into the aluminum heatsink, which is also the housing baseplate.

## Thermal & Mechanical Integration

Thermal simulation drives heatsink selection, FET placement, and airflow assumptions so the electrical and mechanical designs converge rather than fight each other late in the build.

### Thermal Stack

| Path                            | $$R_\theta$$ (°C/W) |
| ------------------------------- | ------------------- |
| Junction → case (datasheet)     | 0.35                |
| Case → PCB (solder pad)         | 0.06                |
| PCB thermal vias (conservative) | 2.00                |
| PCB → aluminum heatsink (TIM)   | 2.00                |
| Heatsink → ambient (10 mm Al)   | 0.60                |
| **Total**                       | **5.01**            |

At a deliberately pessimistic 80 A continuous draw shared across three phases, per-FET dissipation is ≈ 10.24 W (using the datasheet 14.4 mΩ $$R_{DS(on)}$$), giving a worst-case junction rise of ~51.3 °C — well under the 175 °C absolute max. Passive cooling was therefore deemed sufficient; the heatsink was milled from 6061 aluminum, with NTC thermistors monitoring temperature in firmware.

### Housing & Manufacturing

The housing was designed in Onshape with PCB and TE Connectivity connector models imported in. Sides and lid were CNC-routed from 6061; the HAAS 3-axis mill engraved the phase and DC labels. Custom HV connectors were built from CNC-cut copper bars with 3D-printed PLA shrouds because off-the-shelf HV connectors were outside the budget.

## Safety Philosophy

Because this inverter is intended to drive a vehicle, the safety story is treated as a first-class deliverable rather than an afterthought:

- **Firmware fault state machine** with explicit, testable transitions for each fault class. Active switching is gated on verified rails, sensor health, gate-driver status, and a vehicle-level enable.
- **Hardware interlocks** for gate-drive enable.
- **Sensing redundancy** on critical channels.
- **Defined safe state** the system falls back to on any unhandled condition.

### Hardware Fail-Safe — Three-Phase Low-Side Short

A secondary, hardware-mediated protection path is wired off the DC-link current sensor's overcurrent output (threshold set at 75 A). On a severe DC overcurrent — particularly an uncontrolled regen event or loss of normal PWM authority — this signal can force a **three-phase low-side short**, clamping the motor terminals through the low-side devices. The back-EMF-driven current is then contained in the motor + inverter loop instead of being driven into the DC-link capacitors and battery interface. This is a last-resort path, coordinated with the gate-driver safety logic and firmware fault handling.

## Diagnostics & Logging

The controller exposes two CAN interfaces, deliberately separated:

- **FDCAN1 — vehicle bus.** Classic CAN 2.0 at 250 kbps, shared with the rest of the car. Carries vehicle commands, inverter status, and fault frames.
- **FDCAN2 — private diagnostic bus.** CAN FD at 1 Mbps arbitration / 5 Mbps data, used for high-bandwidth streaming of control variables, sensor data, and gate-driver status during bring-up and calibration without loading the vehicle bus.

An on-board EEPROM stores the active fault state, status flags, and a rolling window of pre-fault data on shutdown, so the next power-up can report previous fault context to the diagnostic interface — useful for tracing intermittent issues across testing sessions.

## Bring-up & Status

Bring-up was staged: LV rails → gate drives → power stage at reduced DC-link voltage → full-power operation. The inverter was then paired with the Mitsuba motor on the bench and successfully spun under **six-step commutation using Hall-effect rotor position feedback**. This validated the full system path — power stage, gate-drive interface, isolated sensing, rotor feedback, and the embedded control framework — at a system level. The same setup was demonstrated at the Spring 2026 ECE Design Day.

Full closed-loop FOC implementation and validation remain future work due to project time and shipping constraints. The dq model, decoupling/feedback-linearization terms, PI gain selection, SVPWM strategy, sensing architecture, fault state-machine skeleton, and power-stage hardware were all developed to provide the foundation for that next step.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LysanderInverter489/firstSpinSetup.png" title="First-spin bench setup" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Bench setup for the inverter's first closed-loop spin of the Mitsuba motor.
</div>

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include video.liquid path="assets/img/LysanderInverter489/designDaySpin_spring2026.mp4" class="img-fluid rounded z-depth-1" controls=true muted=true %}
  </div>
</div>
<div class="caption">
  Spring 2026 ECE Design Day — full inverter + motor setup running on the bench.
</div>

## Status & Next Steps

Current focus areas:

- Migrating from six-step commutation to full FOC using the characterized PMSM model and the analytically derived PI gains ($$K_p \approx 1.05\,\Omega$$, $$K_i \approx 1760\,\Omega/s$$ at 318 Hz current-loop bandwidth).
- Validating the fault state machine against injected faults on the bench, including the 75 A hardware short fail-safe path.
- Tuning the current and speed loops against the characterized PMSM.
- Closing the loop on thermal performance under representative load profiles.
- Adding firmware-controlled active DC-link discharge, HV-derived auxiliary LV supply, and pre-charge sequencing — identified for v2 but deferred from this revision.

## Acknowledgments

Thanks to the MSU Solar Racing team for supporting this build, and to the collaborators above for the cross-disciplinary effort that a traction inverter actually requires — power electronics, controls, firmware, thermal, and integration all have to land together for the vehicle to move.
