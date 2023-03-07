---
layout: post
title: "Kinematic wheel plane control of a Honda Civic EK Hatchback front suspension"
categories: [suspension, kinematics, ek20r]
---

![EK Hatchback at CTMP 2021](/assets/images/2023-02-09/ek-ota-ctmp-2021.jpg)

The late 80s and 90s were a golden era for Honda vehicles, thanks in part to
their double wishbone front suspension design. These cars offered exceptional
handling at an affordable price, making them popular choices for enthusiasts
even today. But to fully unlock the potential of a double wishbone suspension,
it's important to understand its kinematic performance.

Kinematics is the study of motion without considering the forces involved, and
a suspension system's ability to control wheel motion is a key factor in its
overall performance. This is where kinematic wheel plane control comes into
play, focusing on metrics like toe and camber variation in heave.

In this study, we analyze the kinematic wheel plane control for the front axle
of a modified 2000 Honda Civic EK Hatchback. By using computer simulation, we
evaluate the performance of the front suspension and identify its strengths and
limitations.

<div class="info">
    <span class="material-icons" style="margin-right:0.25em">info</span>
    <div>
    This is a multipart series on the kinematic analysis of Formula Delta 2000
    Honda Civic EK Hatchback. To learn more about suspension kinematics for
    this chassis, feel free to check out other posts from the series.
    <div style="margin-left:1em">
      <li><a href="/jekyll/update/2023/02/07/intro-to-front-kinematics-ek20r.html">Introduction to front suspension kinematics of a Honda Civic EK Hatchback</a></li>
      <li style="list-style-type: '✓'"><a href="/jekyll/update/2023/02/09/front-kinematic-wheel-plane-control-ek20r.html"><i>Kinematic wheel plane control of a Honda Civic EK Hatchback front suspension</i></a></li>
    </div>
    </div>
</div>

## Acknowledgements

I would like to thank the following contributors for making this project possible.

- **Jay Thornton** from [Race3 Motorsport][race3-website]. After seeing one of
  [our Instagram posts][ek-upright-instagram] showcasing our preliminary effort
  in reverse engineering the front upright, Jay reached out to us and offered
  to 3D scan the part at his shop in Niagara Falls, ON. The resulting 3D scans
  proved to be invaluable for our reverse engineering efforts. We would not
  have been able to achieve the same level of success without Jay's
  contributions. To learn more about Race3 Motorsports, please visit their
  website at [www.race3.ca][race3-website], or follow them on
  [Facebook][race3-facebook] and [Instagram][race3-instagram] at
  [@race3_motorsports][race3-instagram].

- **Ping Cheng Zhang** from [Formula Delta][fd-website]. Ping has been an
  instrumental part of this project from the start. Despite a busy time attack
  season, Ping took every opportunity to reverse-engineer parts of the EK20R.
  This involved diligently measuring physical components and ensuring that
  their digital representation were accurate. Through several rounds of
  discussion and collaboration, we were able to extract a useful set of
  suspension points, laying the foundation for a kinematic analysis of the
  front suspension of the Formula Delta EK20R.

<div class="info">
    <span class="material-icons" style="margin-right:0.25em">volunteer_activism</span>
    <div>
    This project is driven by our passion for vehicle dynamics and our desire
    to share our knowledge with the community. We appreciate the support that
    allows us to undertake these ambitious projects. We are always looking for
    partners to make these projects possible. If you would like to learn more
    about our work, reach out to us through our <a
    href='https://formuladelta.ca/contact-us/'>website</a>, <a
    href='https://www.facebook.com/FormulaDeltaConsult'>Facebook</a> or <a
    href='https://www.instagram.com/formula.delta/'>Instagram</a>.
    </div>
</div>

## Kinematic simulation

Suspension kinematics is the study of the movement and geometry of a vehicle's
suspension system, without consideration of forces. The motion of the
suspension system can be controlled to modify how the tire is presented to the
road. Consequently, this presents an opportunity for designers to tune the ride
comfort and handling performance of the vehicle through the design of the
suspension system.

Computer simulation is frequently used to analyze the suspension system as the
analysis of spatial mechanisms can be difficult to intuitively understand. To
perform this analysis, a virtual model of the suspension system is created
using a list of suspension coordinates. This model can then be articulated
through its range of motion and analyzed. A visualization of the kinematic
model is shown in the figure below.

<video autoplay loop mute controls poster="/assets/images/2023-02-05/ek-heave-animation.jpg">
  <source src="/assets/images/2023-02-05/ek-heave-animation.webm" type="video/webm">
  <source src="/assets/images/2023-02-05/ek-heave-animation.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

This study uses the [SolveSpace][solvespace-website] geometric constraint
engine as a kinematic solver, and makes use of
[`python-solvespace`][python-solvespace-docs] and [`slvstopy`][slvstopy-github]
to facilitate the development of the virtual model.

## Vehicle under study

![Formula Delta EK20R vehicle under study](/assets/images/2023-02-09/ek-formuladelta-tmp-2022.jpg)

The kinematic model used in this study is based on the front suspension of a
modified 2000 Honda Civic Hatchback (EK) using components from a 1998 Honda
Integra (DC2), including the subframe, lower control arm, and upright. The
upper control arm is assumed to be adjustable. Wheel fitment is 215/45R16 7Jx16
ET50 from a 1998 Honda Integra DC2 Type-R. To achieve zero static toe and zero
static camber at nominal ride height, a virtual alignment is performed by
adjusting the upper control arm and tie rod.

The purpose of this study is to evaluate the suspension performance of the
suspension system from the factory. This provides a baseline assessment of the
suspension system without modification. Identifying the system's strengths and
limitations can offer insights into the original design intent and its
modification potential. This is crucial for achieving efficient performance
outcomes from the vehicle development process.

It is important to note that each vehicle presents a unique scenario, and as
such, we recommend using this analysis as a reference for relative changes
rather than an absolute guide. Correlational studies are a standard practice in
the industry. and we encourage you to conduct your own before making any
specific decisions around vehicle development.

## Kinematic wheel plane control

Kinematic wheel plane control refers to the ability of the suspension system to
control the wheel motion as it is articulated. This motion is intrinsic to the
arrangement of the suspension linkages. Kinematic wheel plane control has
strong physical meaning and can be observed simply by lifting the wheel up an
down in real life.

The understanding of kinematic wheel plane control is a crucial aspect of
suspension analysis since the orientation of the tire with respect to the road
has a significant impact on the vehicle's performance. It is a primary concern
of the suspension system to manage the tire orientation in a desirable manner.

In this study, the front suspension is articulated in heave from -50mm to 100mm
at successive displacements of the steering rack. When the steering rack
displacement is positive, it moves the left. The animation below shows the
front quarter view of the front left wheel as it moves through the imposed
motion boundaries.

<video autoplay loop mute controls poster="/assets/images/2023-02-09/ek-front-quarter-car-animation.png">
  <source src="/assets/images/2023-02-09/ek-front-quarter-car-animation.webm" type="video/webm">
  <source src="/assets/images/2023-02-09/ek-front-quarter-car-animation.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

### Half track variation

Half track variation refers to the lateral movement of the tire contact patch
as the suspension system moves in bump. This is a direct output from the
results of the kinematic simulation.

A change in the track width will cause a lateral velocity to be developed at
the contact patch. This is significant because this will create a corresponding
side force due to the half track induced slip angle. The behaviour of the
lateral swing axle instant centre and the kinematic roll centre can be inferred
by observing the half track variation in bump.

The figure below shows the half track variation of the suspension as it is
articulated in bump in parallel wheel travel. A positive half track variation
means that the half track is increased from nominal.

![EK half track variation in heave](/assets/images/2023-02-09/ek-front-heave-halftrack.png)

The half track variation always increases in bump; the derivative with respect
to heave displacement is always positive. This indicates that the kinematic
roll centre remains above the ground as the axle is articulated in bump.

The effect of the steering axis is also observed, with the half track tending
to decrease with large displacements of the steering rack, especially the right
wheel. The left wheel initially increases its half track with steer, but this
trend is reversed when the steering rack is displaced 30 mm.

### Wheel centre recession

Wheel recession refers to the longitudinal movement of the wheel centre as the
suspension moves in bump. This is measured directly from the kinematic
simulation results. Wheel recession is desirable for ride comfort and impact
harshness.

The following figure shows the wheel centre recession of the suspension as it
is articulated bump during parallel wheel travel. A positive wheel recession
value means that the wheel centre moved backwards from its nominal position.

![EK half track variation in heave](/assets/images/2023-02-09/ek-front-heave-wheelrecession.png)

There is very little wheel centre recession in bump when the steering is on
centre. This suggests kinematic wheel recession in bump was not a design goal.
The L-shaped lower control arm suggests that ride harshness is primarily
managed primarily with compliant wheel plane control techniques. The L-shaped
lower control arm allows some decoupling of the lateral and longitudinal load
paths through the control arm. This allows harshness and handling concerns to
be controlled and tuned separately.

The steering induced wheel recession is not as intuitive to understand. This is
likely an artifact of the toe variation in bump as the wheel slightly rotates
about the steering axis.

### Toe variation

Toe variation refers to the change toe angle as it is articulated in bump. This
is measured by taking the angle between the wheel plane as it crosses through
the ground and the vehicle centre plane.

Toe variation in bump is commonly referred to as _bump steer_. This has an
creates a _roll steer_ effect to occur while cornering. Toe variation in bump
can be used to control the dynamic alignment of the vehicle. Roll steer is
often a consideration in an understeer budget calculation per the cornering
compliance concept.

The toe variation in bump for the vehicle under study is shown in the figure
below. A positive toe angle indicates toe out and a negative toe angle
indicates toe in.

![EK half toe variation in heave](/assets/images/2023-02-09/ek-front-heave-toe.png)

The on-centre toe variation is nearly constant and changes very little, varying
less than ±0.2 deg within the range of motion. Steering as an input controls
the toe angle of the tire, so the toe offset with steer is expected. However,
unlike the on-centre behaviour, an amount of _bump steer_ is apparent as the
wheels are steered. This is an important consideration as it is ultimately the
dynamic alignment that needs to be considered for vehicle setup.

### Bump steer

To gain a deeper understanding into toe variation behaviour of the front axle,
we will study the _bump steer_ characteristics more directly. Bump steer is the
rate of toe variation in bump. This is measured by taking the derivative of the
toe angle with respect to the bump displacement.

The figure below shows the bump steer for the vehicle under study. A positive
value refers to a tendency to toe-out in bump and a negative value refers to a
tendency to toe-in during in bump.

![EK half bump steer in heave](/assets/images/2023-02-09/ek-front-heave-toe-gradient.png)

The on-centre bump steer at nominal ride height 2.2 deg/m. This is relatively
low by passenger car standards. Bump steer linearity is maintained up to a
point where it quickly decreases and changes sign.

The magnitude of bump steer progressively increases with steering with the
outside wheel tending to toe-out with steer and the inner wheel tending to
toe-in with steer. The non-linearity of the right wheel is not as interesting
to observe as it will likely be in droop during a corner.

### Camber variation

Camber variation refers to the change in camber angle as the wheel is
articulated in bump. This is measured by taking the angle between the wheel
plane and the vehicle centre plane.

Camber variation modifies how the tire is presented to the road as the
suspension articulates. It is an important consideration because the tire is
sensitive to its inclination relative to the road. Camber compensation through
kinematics or static alignment allows this to be modified.

The following figure shows the camber variation in bump during parallel wheel
travel. A positive value indicates the top of the wheel leans outwards with
respect to the vehicle centre plane. A negative value indicates the top of thew
heel leans inwards with respect to the vehicle centre plane.

![EK half track variation in heave](/assets/images/2023-02-09/ek-front-heave-camber.png)

Camber tends to decrease with bump. This trend accelerates as the suspension is
further articulated in bump. Steering effects are apparent when comparing the
left and right wheels. Unlike the left wheel which is insensitive to the
steering rack displacement, the right wheel camber curve is offset with each
increment of the steering rack. This effect can be attributed to the kingpin
inclination, caster angle and the direction of steer imposed on each wheel.

## Final comments

In this study, we analyzed the kinematic wheel plane control for the front axle
of a modified 2000 Honda Civic EK Hatchback. The performance of the front
suspension is promising, and highlights the advantages of the double wishbone
configuration used in this generation of Honda vehicles.

The interesting findings to highlight from the analysis include the rising half
track variation, the minimal wheel centre recession and the dynamic toe-out in
combined bump and steer. The design of the lower control arm implies that ride
harshness is an elastokinematic concern.

Kinematic wheel plane control covers some of the most foundational suspension
metrics you could look at. While we used computer simulation in this study,
these metrics can be measured empirically. Understanding the working range of
the suspension system is important for vehicle setup. Getting the chassis to
work within its performance window is key to getting the efficiency from your
vehicle development process. Kinematic wheel plane control can be a powerful
tool in understanding your vehicle, giving you the information you need to get
the most performance out of your car.

## References

1. Blundell, Michael, and Damian Harty. _Multibody systems approach to vehicle dynamics_. Elsevier, 2004.
1. Dixon, John C. _Tires, Suspension and Handling_, Second Edition. Warrendale, PA: SAE International, 1996.
1. O’Connell, Jay. “Design and Development of a New Suspension System for the Caterham SV-R,”

[race3-website]: https://www.race3.ca/
[race3-instagram]: https://www.instagram.com/race3_motorsport/
[race3-facebook]: https://www.facebook.com/race3motorsport
[ek-upright-instagram]: https://www.instagram.com/p/B-Poahvn94o/
[fd-website]: https://formuladelta.ca/
[fd-website-contact]: https://formuladelta.ca/contact-us/
[fd-instagram]: https://www.instagram.com/formula.delta/
[fd-facebook]: https://www.facebook.com/FormulaDeltaConsult
[python-solvespace-docs]: https://pyslvs-ui.readthedocs.io/en/stable/python-solvespace-api/
[slvstopy-github]: https://github.com/kktse/slvstopy
[solvespace-website]: https://solvespace.com/index.pl
