---
layout: post
title: Motion ratio curves of the Acura RSX rear suspension
date: 2020-12-10 17:30:00 -0500
modified_date: 2022-10-22
categories: [suspension, kinematics, acura rsx]
---

> This article is part of a series on the kinematic simulation and analysis of
> the Acura RSX suspension. To learn more, feel free to check my other posts:
>
> Front Suspension
>
> - [Analysis of the Acura RSX front suspension geometry](/jekyll/update/2020/01/30/static-suspension-geometry-analysis-acura-rsx.html)
> - [Kinematic curves of the Acura RSX front suspension](/jekyll/update/2020/06/21/rsx-kinematic-curves.html)
> - [Motion ratio curves of the Acura RSX front suspension](/jekyll/update/2020/07/25/rsx-front-motion-ratios.html)
> - [Kinematic roll centre analysis of the Acura RSX front suspension](/jekyll/update/2020/09/07/rsx-front-kinematic-roll-centre.html)
>
> Rear Suspension
>
> - [Kinematic curves of the Acura RSX rear suspension](/jekyll/update/2020/12/10/rsx-rear-kinematic-curves.html)
> - [**You are here!** - Motion ratio curves of the Acura RSX rear suspension](/jekyll/update/2020/12/10/rsx-rear-motion-ratios.html)
> - [Kinematic roll centre analysis of the Acura RSX rear suspension](/jekyll/update/2020/12/10/rsx-rsx-rear-kinematic-roll-centre.html)
>
> Full Vehicle
>
> - [Anti-lift, anti-dive and kinematic pitch centre analysis of the Acura RSX suspension](/jekyll/update/2021/02/19/rsx-suspension-longitudinal-antis.html)

![rsx cover](/assets/images/2020-12-06/rsx-cover-2.jpg)

Modern vehicle suspension systems are carefully designed to react handling
loads while maintaining good ride and comfort. Performance objectives are
often at odds with chassis packaging where cabin space takes precedence over
suspension packaging. For performance enthusiasts hoping to operate the car
at its limits, it means dealing with compromises from the factory.

The Acura RSX is an example of a car that has this challenge. As a daily
driver, its compact rear suspension makes it a very practical car. From a
performance perspective, the tradeoffs to achieve this are less clear. To
answer this, we ran a series of kinematic studies.

This is article, we measure the motion ratios of the rear coilover assembly
and anti-roll bar using kinematic simulation.

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

This suspension topology is cost effective with minimal compromise on
kinematic performance. Its compact size and reduced chassis attachment points
contribute to its cost effectiveness. Aftermarket adjustment to the geometry
is limited since the lower control arm has the responsibility of four links.
Practically any major change to the suspension geometry would require a
completely new knuckle or lower control arm. Fortunately, we can analyze the
design to determine how to make the most of it without resorting to
modification.

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

- $$ dx\_{elem} $$ is the change in the element length
- $$ dx\_{wc,z} $$ is the change in the wheel centre vertical position

The Acura RSX rear suspension has two motion ratios of interest: the coilover
assembly and the anti-roll bar. Both the coilover assembly and the anti-roll
bar are actuated via the lower control arm.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-12-06/rsx-rear-iso-inner.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

### Coilover Motion Ratio

The coilover assembly on the rear suspension contains both the spring and the
damper. Because they act on the same line-of-action, they share the same
motion ratio. The assembly is laterally offset from the wheel centre plane so
a reduced motion ratio is expected.

![spring damper coilover motion ratio](/assets/images/2020-12-06/rsx-rear-left-mrcoil.svg)

The motion ratio is 0.586 mm displacement per mm of wheel centre travel at
factory ride height. You can expect the motion ratio to decrease in bump.

### Anti-roll Bar Motion Ratio

<div class="info">
    <span class="material-icons" style="margin-right:0.25em">info</span>
    <div>
    <b>October 22, 2022</b> - the rear anti-roll bar motion ratio was updated
    to correct an error. The charts and values below reflect the corrected
    analysis.
    </div>
</div>

The rear anti-roll bar is actuated by an end link attached to the lower
control arm. This design packages nicely, but is suspectable to motion ratio
variation due to change in angle of the end link. The anti-roll bar twist
angle is measured as the side-view angle of the arm relative to the
horizontal plane.

![anti-roll bar motion ratio](/assets/images/2020-12-06/rsx-rear-left-mrarb.svg)

The motion ratio is 0.201 deg of twist per mm of wheel centre travel at
factory ride height. You can expect the motion ratio to decrease in bump.

## Final Comments

The packaging constraints faced by the manufacturer are apparent when
analyzing the motion ratios of the Acura RSX rear suspension. Because the
coilover assembly is offset from the wheel centre, the motion ratio is
reduced. A contrasting difference with the front axle is that the rear
anti-roll bar motion ratio is approximately double the front.

Motion ratios are important when choosing aftermarket springs or dampers.
Stiffness is doubly reduced due to the mechanical disadvantage and the
lessened displacement. Knowing the motion ratios for your car are a huge help
to chassis setup - an advantage for anyone developing a car!

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
