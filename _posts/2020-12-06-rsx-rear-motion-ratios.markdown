---
layout: post
title: Motion ratio curves of the Acura RSX rear suspension
# date: 2020-06-21 14:30:00 -0400
categories: [suspension, kinematics, acura rsx]
---

{% include mathjax.html %}

![rsx cover](/assets/images/2020-12-06/rsx-cover-2.jpg)

Modern vehicle suspension designs are carefully designed to react handling
loads while maintaining a good ride and comfort. Performance objectives are
often at odds with chassis packaging where cabin space takes precedence over
suspension packaging. This makes rear suspension design challenging for
manufacturers. For performance enthusiasts hoping to operate the car at its
limits, it means dealing with compromises from the factory.

The Acura RSX is an example of a car with this challenge. As a daily driver,
its compact rear suspension makes it a very practical car. From a performance
perspective, the tradeoffs made to achieve this are less clear. To answer
this, we ran a series of kinematic studies.

This is article, we measure the motion ratios of the rear coilover assembly
and anti-roll bar through the use of our kinematic simulation.

## Suspension Design

The rear suspension of the Acura RSX features an H-arm and camber link. The
H-arm is formed by the lower control arm and is responsible for reacting
braking and cornering forces. The camber link is the upper control arm and
only reacts cornering forces. Both lower and upper control arms contribute to
the location of the front-view kinematic roll centre. Because the upper
control arm only reacts cornering forces, the side-view kinematic instant
centre is controlled by the lower control arm. The rear suspension is
pictured below with the real life and virtual representations shown on the
left and right respectively.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 20px 20px 20px; max-width: 1000px">
    <img src="/assets/images/2020-12-06/rsx-rear-suspension-actual.jpg" alt="actual rsx rear suspension" width="49%"> <img src="/assets/images/2020-12-06/rsx-rear-suspension-model.png" alt="model rsx rear suspension" width="49%">
  </div>
</div>

This suspension topology is cost effective and makes few compromises on
kinematic performance. Its compact size and reduced chassis attachment points
contribute to its cost effectiveness. Aftermarket adjustment to the geometry
is limited since the lower control arm has the responsibility of four links.
Practically any major change in the suspension geometry would require a
completely new knuckle or lower control arm. Fortunately, we can analyze the
design to determine its performance characteristics and understand how to
make the most of it without resorting to modification.

## Motion Ratios

The effect of a resistive element in a suspension system is multiplied by
some kinematic factor representing the mechanical advantage or disadvantage
as experienced at the wheel centre. This is important to consider because the
effect of a spring rate or anti-roll bar change can be more or less due this
advantage.

In this analysis, we define the motion ratio as the rate of change of an
element's displacement relative to the wheel centre vertical position. The
quantities are numerically differentiated using a second-order central
difference. Mathematically:

$$ {MR} = \frac{dx_{elem}}{dx_{wc,z}} $$

Where:

* $$ dx_{elem} $$ is the change in the element length
* $$ dx_{wc,z} $$ is the change in the wheel centre vertical position

The Acura RSX rear suspension has two motion ratios of interest: the coilover
assembly and the anti-roll bar. Both the coilover assembly and the anti-roll
bar are actuated via the lower control arm.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-12-06/rsx-rear-iso-inner.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

### Coilover Motion Ratio

The coilover assembly on the rear suspension contains both the spring and the
damper. Because they act on the same line-of-action, they share the same
motion ratio. The assembly is laterally offset from the wheel centre plane,
so a reduced motion ratio is expected.

![spring damper coilover motion ratio](/assets/images/2020-12-06/rsx-rear-left-mrcoil.svg)

The motion ratio is 0.586 mm displacement per mm of wheel centre travel at
factory ride height. You can expect the motion ratio to decrease in bump
travel.

### Anti-roll Bar Motion Ratio

The rear anti-roll bar is actuated by a lower control arm mounted end link.
This design packages nicely, but is suspectable to motion ratio variation due
to change in angle of the end link. The anti-roll bar angle is measured as
the side-view angle of the arm relative to the horizontal plane.

![anti-roll bar motion ratio](/assets/images/2020-12-06/rsx-rear-left-mrarb.svg)

The motion ratio is 0.193 deg of twist per mm of wheel centre travel at
factory ride height. The motion ratio reaches a maximum of 0.194 deg/mm at
around 15mm of bump travel. On either side of this point, you can expect the
motion ratio to decrease.

## Final Comments

The packaging challenges faced by the manufacturer are apparent when
analyzing the motion ratios of the Acura RSX rear suspension. Because the
coilover assembly offset from the wheel centre, the motion ratio is reduced.
In contrast with the front suspension, the rear anti-roll bar motion ratio is
approximately double the front.

The motion ratios are important when choosing custom spring or damping rates.
Stiffness is doubly reduced due to the reduction in mechanical advantage and
displacement. Having these values are a huge help to chassis setup - an
advantage for anyone developing a car!

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
