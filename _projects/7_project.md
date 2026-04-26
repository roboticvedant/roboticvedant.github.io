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

- **Vedant K. Naik** *(ECE — Senior)* — Led system-level control and firmware development, including PMSM modeling, control-law derivation, simulation, and the fault/state-machine logic. Also contributed to sensing-hardware development and the overall safety philosophy.
- **Owen Winegar** *(ECE — Senior)* — Led the SiC power-stage development, including the FET-related power stage and associated gate-drive hardware. Drove hardware bring-up and contributed to the hardware architecture.
- **Abdallah Daha** *(ECE — Senior)* — Led the low-voltage power rails and the final layout/integration of the inverter subcircuits. Drove hardware assembly and bring-up.
- **Dakota Farwell** *(ECE — Senior)* — Led the thermal design and simulation effort for the controller and housing, and led project operations including test coordination and component ordering.

## What's New vs. v1

The first FOC prototype (see [FOC Inverter Prototype](/projects/2_project/)) validated the basic control concept on an FNA25060 IPM and an STM32 platform. v2 is a substantial rework rather than an incremental update:

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

Spinning the motor as a generator gave the back-EMF constant and rotor flux linkage — the last parameter needed to close out the dq model.

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

## Thermal & Mechanical Integration

The controller and housing are designed together. Thermal simulation drives heatsink selection, FET placement, and airflow assumptions, so that the electrical and mechanical designs converge rather than fight each other late in the build.

## Safety Philosophy

Because this inverter is intended to drive a vehicle, the safety story is treated as a first-class deliverable rather than an afterthought:

- Hardware interlocks for DC-link discharge and gate-drive enable.
- Firmware fault state machine with explicit, testable transitions for each fault class.
- Sensing redundancy on critical channels.
- A clearly defined safe state that the system falls back to on any unhandled condition.

## Bring-up & First Spin

After staged power-stage bring-up, the inverter was paired with the Mitsuba motor on the bench for its first closed-loop spin. The same setup was also brought to the Spring 2026 ECE Design Day demonstration.

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

- Completing power-stage bring-up at reduced DC-link voltage.
- Validating the fault state machine against injected faults on the bench.
- Tuning the current and speed loops against the characterized PMSM.
- Closing the loop on thermal performance under representative load profiles.

## Acknowledgments

Thanks to the MSU Solar Racing team for supporting this build, and to the collaborators above for the cross-disciplinary effort that a traction inverter actually requires — power electronics, controls, firmware, thermal, and integration all have to land together for the vehicle to move.
