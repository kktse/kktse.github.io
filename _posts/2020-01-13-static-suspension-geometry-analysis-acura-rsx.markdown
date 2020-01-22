---
layout: post
title:  Analysis of the Acura RSX front suspension geometry
date:   2020-01-13 17:15:00 -0400
categories: jekyll update
---
![rsx cover photo](/assets/images/2020-01-13/rsx_cover.jpg)

Suspension design plays a critical role in vehicle handling. Suspension
designers face with several challenges when designing a new car and must
address conflicting objectives to ensure the best
performance-manufacturability-cost for their vehicle segment. Improvements in
vehicle ride-and-handling have been a net benefit for all drivers, though often
these designs compromise on pure handling performance to achieve performance
targets in other areas.

This is why, for any race engineer or amateur driver, understanding the
suspension design of the vehicle is so important. Understanding and addressing
issues with the suspension design enables further development into the handling
of your race car.

Rarely are suspension hardpoints made available for passenger vehicles. As an
owner of a 2002 Acura RSX Type-S, being able to obtain suspension points for a
vehicle I own is very exciting. This allows us to analysis and understanding in
how the suspension was orignally designed.

In this article, we will be analyzing the static front suspension geometry of a
stock 2002 Acura RSX.

# Front Suspension Design
Honda's _Type-R_ lineup of the late 90s favoured the use of double-wishbone
front suspension designs. The introduction of the DC5 Honda Integra was the
first in the Type-R family to feature a MacPherson strut front suspension
design.

The Honda Integra (and it's Acura RSX cousin) front suspension features an
offset large-diameter coil spring over the damper. The steering rack is mounted
very high up in the vehicle and consequently means the toe link is mounted high
up on the strut assembly. The tie rod linkage extends into the car and
terminates at the steering rack near the centre of the vehicle.

The drop link attached near the middle of the lower control arm with the drop
link pointing upwards towards the anti-roll bar mounting point.

# Methodology
[![actual_rsx_suspension](/assets/images/2020-01-13/rsx_front_suspension.JPG){:width="49%"}](/assets/images/2020-01-13/rsx_front_suspension.JPG) [![simulation_model_suspension](/assets/images/2020-01-13/cad_front_suspension.png){:width="49%"}](/assets/images/2020-01-13/cad_front_suspension.png)

Suspension pickup points were obtained using a combination of reference images
and physical measurements. The pick-up points are imported into our analysis
environment to obtain design metrics.

Three dimensional formulations are used to compute the suspension metrics. Two
dimensional equivalents are obtained by projecting the points onto the wheel
centre plane in side and front views.

The scope of this analysis is to assess primary suspension design metrics with
the vehicle at factory ride height and zero steer angle.

## Instant Axis
The instant axis of rotation is a virtual axis where the suspension assembly
rotates about as it moves in heave without consideration of the tie rod.

For a MacPherson strut, the instant axis is defined as the intersection of the
lower control arm plane and the strut bearing plane normal to the steering
axis.

# Front View
Projecting the instant axis onto the front view of the vehicle produces a
two-dimensional formulation. The intersection of the instant axis with axle
plane gives us the front view instant centre.

Due to symmetry, the roll centre is the intersection of a line of action from
the contact patch to the instant centre and the vehicle centerline plane. The
virtual swing axle length is the distance from the wheel centre to the instant
centre.

[![ic_front](/assets/images/2020-01-13/ic_front_view.png)](/assets/images/2020-01-13/ic_front_view.png)

# Side View
Projecting the instant axis onto the side view of the vehicle produces a
two-dimensional formulation. The intersection of the instant axis with the
wheel centre plane gives us the side view instant centre.

[![ic_side](/assets/images/2020-01-13/ic_side_view.png)](/assets/images/2020-01-13/ic_side_view.png)

# Steering Axis
In a MacPherson strut design, the steering axis is defined by the strut bearing
and the lower ball joint.

The lean angle of the steering axis in side view is the caster angle. In front
view, the lean angle is the steering inclination angle (SAI).

Extending the steering axis to the intersection with the ground plane produces
a point. The lateral distance from this point to the tire centreline is the
scrub radius. The longitudinal distance from this point to the axle centre
plane is the mechanical trail.

[![steering](/assets/images/2020-01-13/steering.png)](/assets/images/2020-01-13/steering.png)

# Motion Ratios
The amount an actuator displaces per unit vertical travel of the tire at the
tire centreline. These values are computed in consideration of all three
dimensions, including angle correction factors. In the Acura RSX, the spring is
cleverly offset from the damper line-of-action such that it is co-linear with
the virtual steering axis. Because of this, there are three actuators of
interest: the spring, the damper and the anti-roll bar.

[![steering](/assets/images/2020-01-13/front_view.png)](/assets/images/2020-01-13/front_view.png)

# Metrics
All the computed metrics are aggregated in the table below.










## Conclusion

{:refdef: style="text-align: center;"}
![owt](/assets/images/2020-01-13/rsx_front_owt.gif)
{: refdef}

## References
