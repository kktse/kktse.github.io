---
layout: post
title: Kinematic roll centre analysis of the Acura RSX rear suspension
categories: [suspension, kinematics, acura rsx]
---

![rsx cover](/assets/images/2020-12-06/rsx-cover-3.jpg)

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

In this article, we will be analyzing the kinematic roll-centre of the Acura
RSX rear suspension in pure heave and in pure roll.

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

## Kinematic Roll Centre

The **kinematic roll centre** is a virtual point on the axle plane where
cornering forces can be resolved into the suspended mass. It provides a great
deal of convenience when studying the forces acting on the suspended mass.

The determination of the **front-view kinematic instant centres** is
simplified by assuming that all four lower control arm points lie on a plane.
This means that the **front-view kinematic instant centre** is found at the
intersection of:

* the plane formed by the H-arm
* the line formed by the camber link projected onto the axle plane
* the axle plane defined by the contact patches and the wheel centres

The intersection of the lines formed by the **front-view kinematic instant
centre** and the **tire contact patch** is the **kinematic roll centre**.

It is important to note that we are using _**kinematic**_ constructs to make
assumptions about how _**forces**_ are reacted into the suspended mass. This
distinction is important because they do not translate directly. For this
reason, we explicitly call this point the _**kinematic**_ roll centre.

### Parallel Wheel Travel

Moving the suspension in **parallel wheel travel** helps us understand what
happens to the kinematic roll centre when both wheels are displaced together.
Since these cars are often lowered with the installation of aftermarket
coilover kits, this gives us an idea of how much the geometry has deviated
from factory trim.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-12-06/rsx-rear-pwt.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

A nice property you can already see from the animation is that the kinematic
roll centre stays above the ground for the entire suspension travel. This is
confirmed in our simulation results.

![parallel wheel travel roll centre height](/assets/images/2020-12-06/rsx-rear-pwt-rcheight.svg)

The kinematic roll centre is nominally 168 mm above the ground at factory
ride height. You can expect the kinematic roll centre to change at a rate of
1.07 mm per mm of heave.

### Opposite Wheel Travel

**Opposite wheel travel** is a motion where both wheels are displaced the same
amount but in opposite directions. This is a considered a contrived motion
because in reality the car is free to move in both heave and roll. The
asymmetry created by this motion is interesting for advanced analysis. Note
that ISO vehicle coordinates are used to refer to direction.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-12-06/rsx-rear-owt.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

From the animation, it is visibly apparent that the kinematic roll centre
moves very little. This is a fascinating property and suggests a deliberate
attempt to minimize the kinematic roll centre lateral migration. Lets take a
closer look at the results from the analysis.

![opposite wheel travel roll centre height](/assets/images/2020-12-06/rsx-rear-owt-rcheight.svg)

The kinematic roll centre height is extremely well controlled. We can see the
kinematic roll centre height increase just over 10 mm with 4 degrees of roll.

![opposite wheel travel roll centre lateral migration](/assets/images/2020-12-06/rsx-rear-owt-rcy.svg)

The same can be said about the lateral roll centre migration. When measured
from the vehicle centre plane, the lateral migration is only about 8mm. This
is a very unique property since the kinematically induced asymmetry is kept
to a minimum. The kinematic roll centre lateral position migrates at a rate
of 1.44 mm per deg of roll when the roll angle is zero.

## Final Comments

Our analysis of the Acura RSX rear suspension suggests deliberate attempts
from Honda to locate the kinematic roll centre. The kinematic roll centre
stays above the ground throughout the range of travel meaning that geometry
correction for lowered vehicles is not necessary; you can make the chassis
work with a lowered suspension kit. At nominal ride height, we see the
kinematic roll centre lateral migration is extremely well controlled. This is
an unusual aspect to for most builders, but a unique one nonetheless.

By analyzing the suspension using kinematic simulation, we start to
appreciate how loads might be reacted by the suspension system. By taking an
analytical approach to the chassis setup problem, we can get a good guess of
Honda's high level design objectives. For anyone serious about chassis setup,
it is a huge performance advantage!

## Acknowledgements

This work is made possible with help from Ping Zhang at [Formula
Delta](https://formuladelta.ca) who shared the suspension points for the
Acura RSX. You can learn more about Ping and his time attack project on his
[website](https://formuladelta.ca),
[Facebook](https://www.facebook.com/FormulaDeltaConsult) or
[Instagram](https://www.instagram.com/formula.delta/).

## References

1. Dixon, John C. _Tires, Suspension and Handling_, Second Edition. Warrendale, PA: SAE International, 1996.
1. Milliken, William F., and Douglas L. Milliken. _Race car vehicle dynamics_. Vol. 400. Warrendale: Society of Automotive Engineers, 1995.
1. Blundell, Michael, and Damian Harty. _Multibody systems approach to vehicle dynamics_. Elsevier, 2004.
