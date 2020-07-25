---
layout: post
title:  Analysis of the Acura RSX front suspension geometry
categories: jekyll update
---

![rsx cover photo](/assets/images/2020-01-30/rsx_cover.jpg)

## Introduction

The suspension system plays an important role in vehicle handling.
Manufacturers design their vehicles to achieve a balance of good ride, handling
and feeling. This balance is delicate, and modifying your car can therefore have unintended consequences. When preparing your car for on-track use,
suspension analysis can help quantify these effects.

With suspension analysis out of reach to the typical enthusiast, an analysis of
an ordinary road vehicle would be insightful for anyone looking to improve
their vehicle's on-track performance. We take on this challenge and analyze the
suspension from an Acura RSX. In the first iteration, we will focus on the
static geometry of the front suspension.

## Suspension Pickup Points

The vehicle we will be studying is the Acura RSX. The Acura RSX was Honda's
first modern sports compact to feature a MacPherson strut front suspension. The
design was largely seen as a downgrade from the double-wishbone front
suspension of the DC2 Integra. To this day, the Acura RSX faces criticism over
the performance of its suspension design.

In order to analyze the suspension, we need to obtain the coordinates the
attachment points. We used a combination of photography, reference imagery and
physical measurements to obtain these points for the Acura RSX.

Using computer analysis, we can build a virtual quarter car and compute design
parameters from the suspension points. Below is a comparison between the actual
suspension and our model. We are using our own custom analysis routines and
using a CAD package to visualize the results.

![actual rsx suspension](/assets/images/2020-01-30/rsx_front_suspension.JPG){:width="49%"} ![simulation model suspension](/assets/images/2020-01-30/rsx-quarter-iso-resize.png){:width="49%"}

### Kinematic Instant Axis

The kinematic instant axis in a MacPherson strut is defined by two planes: an
upper plane defined by the upper strut mount and damper, and a lower plane
defined by the lower control arm. The intersection of these planes is the
kinematic instant axis. The instant axis can be analyzed in 2D by projecting it
onto the axle plane in front view or the wheel plane in side view.

## Front View

Viewing the kinematic instant axis in front view gives us the front view
instant centre. This point is important because it influences how the wheel
forces are reacted and controls the wheel motion in bump. The front view
instant center and the roll center height is shown in the figure below:

![ic front](/assets/images/2020-01-30/rsx-front-ic-markup.png)


## Side View

Similarly to the front view, viewing the instant axis in side view gives us the
side view instant centre. This point is important  because it influences how
the wheel forces are reacted in braking and driving. The side view instant
centre is located above the wheel centre in height. This suggests some amount
of anti-lift and anti-dive geometry. The side view instant center is shown in
the figure below:

![ic side](/assets/images/2020-01-30/rsx-side-ic-markup.png)

### Steer Axis

In a MacPherson strut, the steer axis is defined by the upper strut mount and
the lower ball joint. The steer axis is important to study because it controls
the wheel motion in steering and will influence the steering feeling and
feedback. The front suspension has a substantial amount of kingpin inclination
angle and very little caster angle. This suggests there will be negative camber
loss as the wheels are turned. Typical of front wheel drive vehicles is a small
amount of negative scrub which we can observe in this example. The steering
properties can be seen in the figures below:

![steering front](/assets/images/2020-01-30/rsx-front-view-steering-markup.png)
![steering side](/assets/images/2020-01-30/rsx-side-view-steering-markup.png)

### Motion Ratios

> Update 2020/07/25: the motion ratios have been updated with values derived
> from a kinematic simulation to correct for an error in the original
> calculation.

Motion ratios are the ratios of movement relative to the wheel in bump. There
are three motion ratios of interest in this design: the spring, the damper and
the anti-roll bar. The OEM spring perch is offset from the damper to reduce
bending loads in the strut. This is important to note because installing a coil
over kit will reduce the motion ratio of the spring and increase the bending
loads on the strut.

![motion ratios](/assets/images/2020-01-30/rsx-front-view-markup.png)

## Conclusion

Obtaining suspension points and analyzing its geometry is a tedious but
worthwhile endeavour. We have already gained a lot of insight about the
suspension design as it was intended from the factory. There is nothing
inherently poor about the Acura RSX front suspension design with most of the
performance limitations attributed to the fact it is a MacPherson strut and an
early Honda design.

In this installment, we focused our efforts strictly on the suspension geometry
but have not yet discussed another important topic: kinematics. In our next
installment, we will discuss in more detail what happens when the suspension
begins to move in bump and steer.

{:refdef: style="text-align: center;"}
![owt](/assets/images/2020-01-30/rsx-front-owt.gif)
{:refdef}

## References

1. Milliken, William F., and Douglas L. Milliken. _Race car vehicle dynamics_. Vol. 400. Warrendale: Society of Automotive Engineers, 1995.
1. Blundell, Michael, and Damian Harty. _Multibody systems approach to vehicle dynamics_. Elsevier, 2004.

## Appendix: table of suspension properties

| Property                                | Value | Units |
|-----------------------------------------|-------| ------|
| Instant centre height - front view      | 340   | mm    |
| Instant centre length - front view      | 2641  | mm    |
| Kinematic roll centre height            | 93    | mm    |
| Virtual swing axle length - front view  | 2612  | mm    |
| Instant centre height - side view       | 518   | mm    |
| Instant centre length - side view       | 11000 | mm    |
| Virtual swing axle length - side view   | 11002 | mm    |
| Caster angle                            | 2     | deg   |
| Kingpin inclination angle               | 17    | deg   |
| Scrub radius                            | 19    | mm    |
| Mechanical trail                        | 7     | mm    |
| Motion ratio - spring                   | 0.92  | mm/mm |
| Motion ratio - damper                   | 0.92  | mm/mm |
| Motion ratio - anti-roll bar displacement | 0.41  | mm/mm |
| Motion ratio - anti-roll bar twist      | 0.10  | deg/mm |

