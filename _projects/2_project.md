---
layout: page
title: FOC Inverter Prototype
description: Field Oriented Control (FOC) motor controller development for solar racing applications
img: assets/img/foc_motorC_prototype.png
importance: 2
category: Solar Car
giscus_comments: true
---

# FOC Inverter Prototype Development

**Colaboarators:** Dashiel Matlock

## Project Overview

This project focuses on developing a Field Oriented Control (FOC) inverter prototype for our solar racing team's electric motor system. Our goal is to create a robust and efficient motor controller using modern control techniques like Park and Clarke transforms combined with classical PI control strategies.

More details on current setup: https://github.com/MSU-Solar/motor_controller_schip

## Current Progress

We've achieved several key milestones in our development process:

1. Successfully implemented basic FOC functionality using the FNA25060 Intelligent Power Module (IPM)
2. Currently transitioning to an STM32-based development kit for improved performance and reliability
3. Working on implementing Park and Clarke transforms for more precise motor control
4. Developing a classical PI controller implementation for robust speed and torque control

## Technical Implementation

The Field Oriented Control strategy we're developing offers several advantages for our solar racing application:

- More efficient torque control compared to traditional methods
- Better dynamic response for varying load conditions
- Improved overall system efficiency, crucial for solar racing
- Reduced torque ripple for smoother operation

## Next Steps

Our upcoming development focuses on:

- Implementing advanced control algorithms on the STM32 platform
- Optimizing the PI controller parameters for our specific application
- Developing comprehensive testing procedures for validation
- Creating a more compact and efficient PCB design

## Technical Details

The control system utilizes the following transforms:

1. **Clarke Transform**: Converts three-phase currents (ia, ib, ic) to two-phase orthogonal currents (iα, iβ)
2. **Park Transform**: Converts stationary frame quantities to rotating frame (id, iq)
3. **PI Control**: Implements closed-loop control for both d-axis and q-axis currents

## Acknowledgments

This project is part of our solar racing team's ongoing efforts to improve vehicle efficiency and performance. Special thanks to all team members contributing to this development.