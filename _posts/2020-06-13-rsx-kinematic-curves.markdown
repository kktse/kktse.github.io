---
layout: post
title: Kinematic curves of the Acura RSX front suspension
date: 2020-06-21 14:30:00 -0400
categories: jekyll update
---

{% include mathjax.html %}

![rsx scca autox](/assets/images/2020-06-21/rsx-scca-cover.jpg)

Understanding how the wheel moves relative to the chassis is important because
it affects the tire movement relative to the ground. Suspension geometry is
carefully designed to control this motion in a desirable way. Because the tire
is sensitive to slip and inclination, wheel movement affects tire operation
which in turn affects vehicle handling.

Using kinematic simulation, we can study the wheel plane motion and understand
how the tire is being controlled. In this article, we analyze the front
suspension of an Acura RSX to understand the wheel plane motion as it is
articulated in bump and steer.

## Kinematic simulation
Kinematic simulation is an analysis tool that predicts the wheel motion by
virtually displacing it in bump and steer. This is done by entering the
suspension coordinates into a kinematics solver.

Suspension coordinates are typically not made available for road cars and
require measurements from the car. The suspension coordinates used in this
study are obtained by our own testing. The image below shows the front
suspension geometry of the Acura RSX.

{:refdef: style="text-align: center;"}
![actual rsx suspension](/assets/images/2020-01-30/rsx_front_suspension.JPG){:width="300px"}
{: refdef}

In this study, we use the kinematic simulation to articulate a quarter car
model. From the simulation output, we can study the wheel plane motion to
investigate how well the tire is being controlled. The motions are visualized
below.

<video autoplay loop mute controls>
  <source src="/assets/images/2020-06-21/heave.webm" type="video/webm">
</video>{:width="49%"}

<video autoplay loop mute controls>
  <source src="/assets/images/2020-06-21/steer.webm" type="video/webm">
</video>{:width="49%"}

Coordinates are referenced using the ISO vehicle coordinate system. For
clarity, the sign convention is listed below:

* **$$+X$$** is **forward**
* **$$+Y$$** is to the **left**
* **$$+Z$$** is **up**
* **$$+\delta$$** is steering to the **left**

## Half track variation
The half track variation is lateral displacement of the tire contact patch.
Because the slip angle is the arctangent of the contact patch velocity
components, half track variation results in a lateral velocity at the contact
patch therefore causing tire slip.

![half track variation](/assets/images/2020-06-21/rsx-half-track.png)

In both bump and steer, there are regions where the half track increase is
positive. In bump, that region is between +0mm and +83mm. In steer, that region
is between -4deg and +0deg. You can expect the half track to vary from anywhere
from -20mm to +4mm as the suspension is articulated.

## Camber variation
Tires are sensitive to inclination angle. In other words, the tire is sensitive
to the lean angle relative to the road. The camber variation helps to control
the tire inclination angle as the chassis is in roll.

![camber variation](/assets/images/2020-06-21/rsx-camber.png)

The suspension exhibits diminishing negative camber gain in bump. Near the end
of the suspension travel at +114mm of bump, the suspension reaches maximum
camber. There is some negative camber gained between +0deg and +12deg of
steering; however, this amount is small in comparison to the positive camber
gained outside this region. This is likely because of the large kingpin
inclination angle and small caster angle built into the RSX front suspension
geometry.

## Toe variation
The change in the toe angle with bump is the toe variation, also known as _bump
steer_. When looking at the axle as a whole, the combined toe variation of each
wheel results in _roll steer_. Toe variation is depicted with _steered angle_
to match the sign convention used in other graphs. The steering graph is
omitted because the steering directly changes the front toe angle.

![toe variation](/assets/images/2020-06-21/rsx-toe.png)

The wheel plane tends to toe-in with bump for most of the suspension travel. At
+122mm of bump, maximum toe-in is achieved and the steered angle begins to
increase. This happens near the end of the suspension travel where the wheel
plane already has substantial toe-in at -2.6deg.

## Final comments
Wheel plane control is a foundational part of suspension kinematic analysis.
Kinematic simulation is a tool that can dramatically reduce the cost of
understanding as it delivers insight into the suspension characteristics.

With the Acura RSX, there are interesting properties of the McPherson strut
design. The wheel plane control is intriguing near the end of its suspension
travel. Because vehicles are commonly modified and lowered for track use, this
represents a challenge for vehicle setup and tuning.

## Acknowledgements
I would like to acknowledge **Ping Zhang** at <a
href="https://www.instagram.com/formula.delta/"><svg
class="svg-icon"><use
xlink:href="/assets/minima-social-icons.svg#instagram"></use></svg><span
class="username">Formula Delta</span></a> for obtaining and sharing the
suspension points for this study.

## References
1. Milliken, William F., and Douglas L. Milliken. _Race car vehicle dynamics_. Vol. 400. Warrendale: Society of Automotive Engineers, 1995.
1. Blundell, Michael, and Damian Harty. _Multibody systems approach to vehicle dynamics_. Elsevier, 2004.

