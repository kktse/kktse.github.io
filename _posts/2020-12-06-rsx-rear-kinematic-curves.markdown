---
layout: post
title: Kinematic curves of the Acura RSX rear suspension
# date: 2020-06-21 14:30:00 -0400
categories: [suspension, kinematics, acura rsx]
---

![rsx cover](/assets/images/2020-12-06/rsx-cover-1.jpg)

Modern vehicle suspension systems are carefully designed to react handling
loads while maintaining good ride and comfort. Performance objectives are
often at odds with chassis packaging where cabin space takes precedence over
suspension packaging. For performance enthusiasts hoping to operate the car
at its limits, it means dealing with compromises from the factory.

The Acura RSX is an example of a car that has this challenge. As a daily
driver, its compact rear suspension makes it a very practical car. From a
performance perspective, the tradeoffs to achieve this are less clear. To
answer this, we ran a series of kinematic studies.

In this article, we discuss the wheel plane control of the Acura RSX rear
suspension. Metrics such as half track, camber and toe variation are
examined.

## Suspension Design

The Acura RSX rear suspension features an H-arm and camber link. The H-arm is
formed by the lower control arm and is responsible for reacting braking and
cornering forces. The camber link forms the upper control arm and reacts only
cornering forces. Both lower and upper control arms locate the front-view
kinematic roll centre. The side-view kinematic instant centre is controlled
solely by the lower control arm. The rear suspension is pictured below with
the real life and virtual representations shown on the left and right
respectively.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 20px 20px 20px; max-width: 1000px">
    <img src="/assets/images/2020-12-06/rsx-rear-suspension-actual.jpg" alt="actual rsx rear suspension" width="49%"> <img src="/assets/images/2020-12-06/rsx-rear-suspension-model.png" alt="model rsx rear suspension" width="49%">
  </div>
</div>

This suspension topology is cost effective and makes few compromises on
kinematic performance. Its compact size and reduced chassis attachment points
contribute to its cost effectiveness. Aftermarket adjustment to the geometry
is limited since the lower control arm has the responsibility of four links.
Practically any major change to the suspension geometry would require a
completely new knuckle or lower control arm. Fortunately, we can analyze the
design to determine how to make the most of it without resorting to
modification.

## Kinematic Curves

Tire force and moment properties are sensitive to inputs like slip and
inclination angle. The chassis has some control over these inputs by
carefully designing the suspension to move the wheel in a certain way. In
this context, kinematic curves describe the wheel plane motion without
considering forces or compliances.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-12-06/rsx-rear-iso-outer.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

### Half Track Variation

The half track variation is the lateral displacement of the tire contact
patch. This motion causes a lateral velocity to develop at the contact patch,
thus generating a slip angle. It is also a first look at how the instant
centre might develop. A positive value indicates an increasing half track.

![half track variation](/assets/images/2020-12-06/rsx-rear-left-halftrack.svg)

The half track nominally increases at a rate of 0.213 mm per mm of bump. The
rate of change is always positive within this range of travel.

### Camber Variation

The camber angle is the lean angle of the wheel relative to the chassis
centre plane. This is not the inclination angle experienced at the contact
patch. A negative camber angle indicates that the top of the wheel is leaning
inwards towards the chassis.

![camber variation](/assets/images/2020-12-06/rsx-rear-left-camber.svg)

At around -30 of droop travel, the sign of the camber gain inverts. However,
for the remaining bump travel, the camber gain is positive. You can expect a
gain of -0.014 deg per mm of bump near nominal ride height. This number will
be more negative if the ride height is reduced.

### Toe Variation

The toe angle is the angle between the wheel direction and the vehicle centre
plane. This is the rear axle's contribution to bump and roll steer effects. A
positive value indicates toe in.

![tue variation](/assets/images/2020-12-06/rsx-rear-left-toe.svg)

The toe angle nominally increases at a rate of 0.003 deg per mm of bump. At
first glance, the semi-trailing-like lower control arm suggests lots of toe
variation; however, this effect is likely offset by the knuckle lower
attachment points.

## Final Comments

The rear suspension of the Acura RSX shows good control over the wheel plane
motion. Half track variation is predictable throughout the travel range.
Interestingly, there is very little kinematically induced toe variation.
While the camber gain changes signs, it does so in droop.

The kinematic performance of the Acura RSX rear suspension thus far is
promising. It is much more predicable than the front suspension and displays
fewer oddities. This makes it simpler to understand and hopefully easier to
set up.

## Acknowledgements

This work is made possible with help from Ping Zhang at [Formula
Delta](https://formuladelta.ca) who shared the suspension points for the
Acura RSX. You can learn more about Ping and his time attack project on his
[website](https://formuladelta.ca),
[Facebook](https://www.facebook.com/FormulaDeltaConsult) or
[Instagram](https://www.instagram.com/formula.delta/).

## References

1. Milliken, William F., and Douglas L. Milliken. _Race car vehicle dynamics_. Vol. 400. Warrendale: Society of Automotive Engineers, 1995.
1. Blundell, Michael, and Damian Harty. _Multibody systems approach to vehicle dynamics_. Elsevier, 2004.
