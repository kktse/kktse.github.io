---
layout: post
title: Kinematic roll centre analysis of the Acura RSX front suspension
date:   2020-09-07 15:30:00 -0400
categories: [suspension, kinematics, acura rsx]
---

> This article is part of a series on the kinematic simulation and analysis of
> the Acura RSX suspension. To learn more, feel free to check my other posts:
>
> Front Suspension
>
> * [Analysis of the Acura RSX front suspension geometry](/jekyll/update/2020/01/30/static-suspension-geometry-analysis-acura-rsx.html)
> * [Kinematic curves of the Acura RSX front suspension](/jekyll/update/2020/06/21/rsx-kinematic-curves.html)
> * [Motion ratio curves of the Acura RSX front suspension](/jekyll/update/2020/07/25/rsx-front-motion-ratios.html)
> * [**You are here!** - Kinematic roll centre analysis of the Acura RSX front suspension](/jekyll/update/2020/09/07/rsx-front-kinematic-roll-centre.html)
>
> Rear Suspension
>
> * [Kinematic curves of the Acura RSX rear suspension](/jekyll/update/2020/12/10/rsx-rear-kinematic-curves.html)
> * [Motion ratio curves of the Acura RSX rear suspension](/jekyll/update/2020/12/10/rsx-rear-motion-ratios.html)
> * [Kinematic roll centre analysis of the Acura RSX rear suspension](/jekyll/update/2020/12/10/rsx-rsx-rear-kinematic-roll-centre.html)

![rsx front axle](/assets/images/2020-09-07/rsx-front-cover.jpeg)

## Introduction

Suspension setup is much more than just changing springs and dampers. Modern
multi-link suspensions are carefully designed to react handling loads in a
desirable way. Springs and dampers are only one part of the equation.

Suspension links control how certain loads are transmitted from the tire to
the chassis. The roll centre concept considers this when loads are reacted.
This is especially important for lowered vehicles on aftermarket coil overs
without a geometry correction kit.

The kinematic roll centre, although a virtual point in space, can be found
via computer simulation. We use the suspension points from an Acura RSX to
study how the kinematic roll centre responds to chassis movement.

## Kinematic roll centre

The **kinematic roll centre** is a virtual point on the axle plane where
cornering forces can be resolved into the suspended mass. This point
simplifies a force analysis of the suspended mass to a simple rigid body
dynamics problem.

Before we can discuss the kinematic roll centre, we need to define the
**front-view kinematic instant centre**. The front-view kinematic instant
centre is a virtual point on the axle plane the wheel assembly rotates about.
For a MacPherson strut, the front-view kinematic instant centre is found at
the intersection of:

* the lower control arm plane defined by the two inboard attachment points and the outer ball joint
* the upper strut plane defined by the upper strut attachment point and a normal vector defined by the strut
* the axle plane defined by the contact patches and the wheel centres

By drawing a line from the **tire contact patch** to the **front-view
kinematic instant centre**, we obtain the side force line of action. The
intersection of this line for the left and right wheels is the **kinematic
roll centre**. Force analysis of the suspended mass at the kinematic roll
centre is possible because forces can be translated along its line of action
per the Principle of Transmissibility.

It is important to note that we are using _kinematic_ constructs to make
assumptions about how _forces_ are reacted into the suspended mass. It is for
this reason we explicitly call this point the **_kinematic_** roll centre.

## Parallel Wheel Travel

We begin the analysis by examining the kinematic roll centre in **parallel
wheel travel**. This is a simulation of the front axle in heave where both
wheels are displaced by the same amount in the same direction. This analysis
preserves some convenient properties; there is symmetry along the XZ-plane
and the roadway banking angle stays constant at zero.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-09-07/rsx-pwt-rc.webm" type="video/webm">
  <source src="/assets/images/2020-09-07/rsx-pwt-rc.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

The animation shows the front axle in heave with lines representing the line
of action from the tire contact patch to their respective kinematic instant
centres. You will notice a point at the intersection of the two lines. This
is the kinematic roll centre. Two interesting observations arise from visual
inspection:

1. the kinematic roll centre height decreases and goes below the tire contact patches
1. the kinematic instant centre for each corner flips sides near the end of its jounce travel

We can examine the kinematic roll centre height in more detail by quantifying
its movement relative to the heave displacement. The graph below shows the
kinematic roll centre height with respect to the contact patch vertical
displacement.

![parallel wheel travel roll centre height](/assets/images/2020-09-07/rsx-pwt-rch.svg)

The static kinematic roll centre height at factory ride height is quickly
lost as the axle travels in bump. With just +31mm of bump displacement, the
kinematic roll centre height crosses the ground plane. The reduction of the
kinematic roll centre height in bump is consistent across the wheel travel
range.

The kinematic instant centre flipping near the end of the suspension travel
is noteworthy even if not directly related to the kinematic roll centre
analysis. We already discussed [kinematic wheel plane
control](/jekyll/update/2020/06/21/rsx-kinematic-curves.html) and how the
Acura RSX front suspension is designed from the factory. This is one
explanation for its poor performance near the end of its bump travel.
Suspension parameters are inter-related and this example highlights how
parameters can affect each other.

## Opposite Wheel Travel

Studying the axle in **opposite wheel travel** simulates the axle in roll.
Both wheels are displaced the same amount but in opposite directions. This is
considered a contrived motion because in reality the axle is free to move in
both heave and roll. Despite this, it is still worth investigating due to the
asymmetry created by the motion.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-09-07/rsx-owt-rc.webm" type="video/webm">
  <source src="/assets/images/2020-09-07/rsx-owt-rc.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

The animation shows the front axle in roll with lines representing the line
of action from the tire contact patch to their respective kinematic instant
centres. You can see how opposite wheel travel causes the kinematic roll
centre to move laterally and vertically. In this scenario, the kinematic roll
centre moves towards the contact patch of the wheel in rebound before going into the ground. The relationship between the kinematic roll centre height and the chassis roll angle is shown in the graph below:

![opposite wheel travel roll centre height](/assets/images/2020-09-07/rsx-owt-rch.svg)

The kinematic roll centre is highest above the ground when the roll angle is
zero. The kinematic roll centre height decreases with roll angle regardless
of direction. Beyond 3.5 degrees of roll, the kinematic roll centre passes
through the contact patch of the wheel in rebound before going into the
ground.

![opposite wheel travel roll centre lateral migration](/assets/images/2020-09-07/rsx-owt-rcy.svg)

The kinematic roll centre lateral migration is worth looking at since it is
an indicator of a kinematically induced asymmetry. You can observe the
kinematic roll centre moving through the wheel contact patch by looking at
the lateral migration when the kinematic roll centre is on the ground at 3.5
degrees of roll. The lateral migration will approximately be equal to the
half track.

## Final Comments

MacPherson strut suspensions are limited because they have no upper
suspension link. The angle of the lower control arm plane defines the
position of the kinematic instant centre which in turn controls the kinematic
roll centre height. The Acura RSX has a kinematic roll centre that lowers
into the ground with just over an inch of heave travel. The kinematic instant
centre flip sides near the end of its jounce travel. This is why we see such
poor kinematic wheel plane control in this region.

Installing a coil over kit can be a double-edged sword. These kits often
lower the ride height and can cause the kinematic roll centre to go into the
ground. Carefully selected spring rates can offset this, but will make the
problem worse if tuned incorrectly. Modified lower ball joints raise the
kinematic roll centre by relocating the lower control arm plane. However, not
all geometry correction kits are created equal and must be placed under
scrutiny; some do not provide meaningful correction. Ride height effectively
locates the kinematic roll centre and can be used as another form of
adjustment. The Acura RSX front suspension was clearly designed to operate
within a fixed range of suspension travel. Staying within this range is just
one way preserving the Acura RSX's performance as intended by Honda.

## Acknowledgements

I would like to acknowledge **Ping Zhang** at <a
href="https://www.instagram.com/formula.delta/"><svg class="svg-icon"><use
xlink:href="/assets/minima-social-icons.svg#instagram"></use></svg><span
class="username">Formula Delta</span></a> for sharing the suspension points
used in this study.

## References

1. Dixon, John C. _Tires, Suspension and Handling_, Second Edition. Warrendale, PA: SAE International, 1996.
1. Milliken, William F., and Douglas L. Milliken. _Race car vehicle dynamics_. Vol. 400. Warrendale: Society of Automotive Engineers, 1995.
1. Blundell, Michael, and Damian Harty. _Multibody systems approach to vehicle dynamics_. Elsevier, 2004.
