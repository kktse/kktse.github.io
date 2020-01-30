---
layout: post
title:  Analysis of the Acura RSX front suspension geometry
date:   2020-01-13 17:15:00 -0400
categories: jekyll update
---
![rsx cover photo](/assets/images/2020-01-13/rsx_cover.jpg)

# Introduction
The suspension system plays an important role in vehicle handling. Vehicle
manufacturers develop the suspension system to achieve a balance of good ride,
handling and feeling to the car. This balance is delicate, and modifying your
car can have unintended consequences. When preparing your car for on-track use,
suspension analysis can help quantify these effects.

With suspension analysis being out of reach to the typical enthusiast, an
analysis of a conventional road car would be insightful for anyone looking to
improve their vehicle's on-track performance. We take on this challenge and
analyze the suspension from an Acura RSX. In the first iteration, we will be
focusing on the static geometry of the front suspension.

# Suspension Pickup Points
The vehicle we will be studying is the Acura RSX. The Acura RSX was Honda's
first modern sports compact to feature a MacPherson strut front suspension. The
design was largely seen as a downgrade in comparison to the double-wishbone
front suspension of the DC2 Acura Integra. To this day, the Acura RSX faces
criticism over the performance of its suspension design.

The motion of the suspension is governed by the geometry of the individual
suspension components. In order to analyze the suspension as a whole, we need
to obtain the coordinates of key suspension attachment points.  We used a
combination of photography, reference imagery and physical measurements to
obtain these points for the Acura RSX.

Using computer analysis, we can build a virtual quarter car and compute primary
parameters for the design. Below is a comparison between the actual suspension
and our model. We are using our own analysis routines and visualizing the
results in CAD.

[![actual_rsx_suspension](/assets/images/2020-01-13/rsx_front_suspension.JPG){:width="49%"}](/assets/images/2020-01-13/rsx_front_suspension.JPG) [![simulation_model_suspension](/assets/images/2020-01-13/rsx-quarter-iso-resize.png){:width="49%"}](/assets/images/2020-01-13/rsx-front-iso-resize.png)

## Kinematic Instant Axis
The kinematic instant axis in a MacPherson strut is defined by two planes: an
upper plane defined by the upper strut mount and damper, and a lower plane
defined by the lower control arm. The intersection of these planes is the
kinematic instant axis. The instant axis can be analyzed in 2D by projecting it
onto the wheel plane in front view and side view.

# Front View
Viewing the kinematic instant axis in front view gives us the front view
instant centre. This point carries significance because it influences how the
wheel forces are reacted and controls the wheel motion in bump. The front view
instant center and the roll center height is shown in the figure below:

[![ic_front](/assets/images/2020-01-13/rsx-front-ic-markup.png)](/assets/images/2020-01-13/ic_front_view.png)


# Side View
Similarly to the front view, viewing the instant axis in side view gives us the
side view instant centre. This point carries significance because it influences
how the wheel forces are reacted in braking and driving. The side view instant
centre is located above the wheel centre in height. This suggests some amount
of anti-lift and anti-dive geometry. The side view instant center is shown in
the figure below:

[![ic_side](/assets/images/2020-01-13/rsx-side-ic-markup.png)](/assets/images/2020-01-13/ic_side_view.png)


## Steer Axis
In a MacPherson strut, the steer axis is defined by the upper strut mount and
the lower ball joint. The steer axis is important to study because it controls
the wheel motion in steering and will influence the steering feel and feedback.
The front suspension has a substantial amount of kingpin inclination angle and
very little caster angle. This suggests there will be a lot of negative camber
loss with steering. Typical of front wheel drive vehicles is a small amount of
negative scrub which we can observe in this example. These properties can be
seen in the figures below:

[![steering](/assets/images/2020-01-13/rsx-front-view-steering-markup.png)](/assets/images/2020-01-13/steering.png)
[![steering](/assets/images/2020-01-13/rsx-side-view-steering-markup.png)](/assets/images/2020-01-13/steering.png)


## Motion Ratios
Motion ratios are the ratios of movement relative to the wheel in bump. There
are three elements of interest in this design: the spring, the damper and the
anti-roll bar. The OEM spring perch is offset from the damper to reduce bending
loads in the strut. This is important to note because installing a coil over
kit will reduce the motion ratio of the spring and increase the bending loads
on the strut.

You will notice that the motion ratios are quoted to be much lower than typical
values quoted in the community. We are calculating the motion ratio in
consideration of the lower control arm geometry and the strut in 3D resulting
in a value that is lower than in a conventional front view approximation.

[![steering](/assets/images/2020-01-13/rsx-front-view-markup.png)](/assets/images/2020-01-13/front_view.png)

## Conclusion
Obtaining suspension points and analyzing the geometry is a tedious but
worthwhile endeavour. With a simple static geometry analysis, we have already
gained a lot of insight about the suspension design as it was designed from the
factory. There is nothing inherently poor about the Acura RSX front suspension
design with most of the performance limitations attributed to the fact it is a
MacPherson strut and an early Honda design.

In this installment, we focused our efforts strictly on the suspension
geometry; however,  we have yet to discuss an important aspect of suspension
design - kinematics.  With a little bit of extra work, we can virtually
articulate the suspension and study it as it moves. Here is a sneak peek at
what is coming next!

{:refdef: style="text-align: center;"}
![owt](/assets/images/2020-01-13/rsx-front-owt.gif)
{: refdef}

## References



## Appendix
# Table of Derived Parameters

| Parameter                               | Value | Units |
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
| Motion ratio - spring                   | 0.80  | mm/mm |
| Motion ratio - damper                   | 0.66  | mm/mm |
| Motion ratio - anti-roll bar displacement | 0.33  | mm/mm |
| Motion ratio - anti-roll bar twist      | 0.07  | deg/mm |

