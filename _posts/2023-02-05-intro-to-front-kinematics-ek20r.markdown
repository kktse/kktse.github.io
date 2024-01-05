---
layout: post
title: "Introduction to front suspension kinematics of a Honda Civic EK Hatchback"
categories: [suspension, kinematics, ek20r]
date: 2023-02-07 17:15:00 -0500
---

![EK front suspension cover photo](/assets/images/2023-02-05/ek-ctmp-2021.webp)

Our aim at Formula Delta is to build an efficient time attack vehicle through
the application of our engineering expertise in vehicle dynamics. We believe
that the key to success is to gain a deep understanding of the underlying
performance characteristics of the vehicle and to adjust to both car and driver
to take full advantage of these. Suspension geometry and kinematic analysis is
an important tool we use to achieve these goals.

Kinematics refers to the study of motion without considering the forces
involved. In the context of vehicle dynamics, the study of suspension
kinematics is crucial because it has a direct impact on the performance of the
tires. However, conducting such analysis outside the industry can be
challenging as vehicle manufacturers do not make the suspension geometry or
kinematic data of their road vehicles publicly available, meaning that reverse
engineering is often required.

In this article, we will share our process of analyzing the front suspension of
the Formula Delta EK20R to determine its kinematic performance. We will explain
how we obtained the suspension points through reverse engineering and describe
the workflow we developed to analyze the suspension geometry.

This project marks the culmination of three years of development at Formula
Delta and demonstrates our approach to vehicle development, which we believe is
applicable at all levels of motorsport. I am thrilled to finally share the
results of our hard work and dedication in this suspension kinematics analysis.

<div class="info">
    <span class="material-icons" style="margin-right:0.25em">info</span>
    <div>
    This is a multipart series on the kinematic performance of the Formula
    Delta 2000 Honda Civic EK Hatchback. To learn more about suspension
    kinematics for this chassis, feel free to browse the other posts from this
    series.
    <div style="margin-left:1em">
      <li><a href="/jekyll/update/2023/02/07/intro-to-front-kinematics-ek20r.html"><i>You are here! - Introduction to front suspension kinematics of a Honda Civic EK Hatchback</i></a></li>
      <li><a href="/jekyll/update/2023/03/08/front-kinematic-wheel-plane-control-ek20r.html">Kinematic wheel plane control of a Honda Civic EK Hatchback front suspension</a></li>
      <li><a href="/jekyll/update/2024/01/05/front-steering-analysis-ek20r.html">Steering kinematics of a Honda Civic EK Hatchback front suspension</a></li>
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
    to share our knowledge with the community. We appreciate the support from
    our partners that allows us to undertake these types of projects, and are
    open to working with new collaborators to make these projects possible. If
    you would like to help us produce more technical analysis, or if you would
    like to learn more about our work, reach out to us through our <a
    href='https://formuladelta.ca/contact-us/'>website</a>, <a
    href='https://www.facebook.com/FormulaDeltaConsult'>Facebook</a> or <a
    href='https://www.instagram.com/formula.delta/'>Instagram</a>.
    </div>
</div>

## Kinematic analysis motivation

One aspect of vehicle dynamics engineering is to improve the performance of a
vehicle by maximizing the available grip for the driver. This grip is generated
by operating the tire within a specific window where it performs best. The
suspension and chassis play a crucial role in controlling the tire.
Understanding the kinematics of the suspension helps us to evaluate a vehicle's
ability to control the tire and therefore understand the vehicle's performance
potential.

![EK PITL 2019](/assets/images/2023-02-05/ek-pitl-2019.webp)

At Formula Delta, we have observed two contrasting approaches to vehicle setup
in our club-level work:

- Extensive vehicle modification to improve performance
- Extensive driver training to improve performance

However, these two approaches should not be considered mutually exclusive. By
carefully understanding the underlying performance characteristics of the
vehicle and making informed modifications, we can achieve high performance
without over-modifying the car. The conventional development process often
involves a trial-and-error approach, which can be time-consuming and produce
disappointing results. Through systematic analysis, such as kinematics
analysis, we can streamline the process and achieve efficient and effective
performance gains.

## Obtaining suspension points

Kinematic analysis relies on accurate information about the suspension point
locations. For this project, we obtained these locations by reverse engineering
the front suspension components of the Formula Delta EK20R. The process
involved manual measurements, 3D scanning, and technical references. These
techniques allowed us to create digital representations of each component,
which were then assembled to extract the suspension points from the digital
model. The digital assembly and its real life counterpart are shown in the
images below.

![EK Front Suspension - Real Life](/assets/images/2023-02-05/ekfront-real.webp){: style="width: 49%"} ![EK Front Suspension - Digital Assembly](/assets/images/2023-02-05/ekfront-assembly.webp){: style="width: 49%"}

The Formula Delta EK20R uses parts from various Honda chassis. For clarity, we
will note the following differences from a factory Honda Civic EK Hatchback.

- The **upper control arm** is based on a Honda Civic EK chassis and is assumed
  to be camber adjustable
- The **subframe** is based on a Honda Integra DC2 chassis
- The **upright** is based on a Honda Integra DC2 chassis
- The **wheel fitment** is based on 215/45R16 7Jx16 ET50 wheel and tire
  combination from a Honda Integra DC2 Type R

With the suspension point locations established, we can begin to examine the
role they play in the analysis workflow.

## Kinematic analysis workflow

There are various commercial kinematic analysis software options available,
such as [SusProg3D][susprog-website] and [Lotus SHARK][lotus-shark-website],
but for this project, we decided to design our own custom workflow. We utilized
[SolveSpace][solvespace-website], a parametric CAD software, to create a
three-dimensional spacial model of the suspension geometry, which was then
imported into a programmable environment using libraries like
[`python-solvespace`][python-solvespace-docs] and
[`slvstopy`][slvstopy-github]. The flow chart below displays the entire process
of our analysis.

![Analysis Workflow](/assets/images/2023-02-05/analysis-workflow.png){: style="max-width: 80%; display: block; margin: 2em auto"}

The kinematic analysis is conducted within a [Jupyter][jupyter-website]
notebook, an interactive platform for computational projects. The analysis is
supported by three services, which provide high-level interfaces to specific
analysis functions and simplify computational and implementation complexities.

This workflow offers several key features that enhance its flexibility and
performance:

- **Input Grids**: The solver service can seamlessly handle combined steering
  and bump motions.
- **Multi-threaded Processing**: The analysis service utilizes multiple CPU threads
  to improve computation speed.
- **Equation Reduction**: The analysis service is computationally efficient,
  thanks to the simplification of underlying equations through the use of
  symbolic derivations.

The result is an adaptable workflow that can be used to analyze any suspension
system and compute any metric, without the need for commercial analysis
software or post-processing limitations. By designing and implementing this
workflow, we have full control over the analysis process and can save on cost.

## Results and future work

The output of our analysis workflow delivers the solved kinematics and post-processed results, including:

- Camber angle
- Toe angle
- Motion ratio of the coilover
- Motion ratio of the anti-roll bar
- Caster angle
- Kingpin inclination angle
- Scrub radius
- Mechanical trail
- Roll center height

Thanks to flexibility of our approach, we have the freedom to analyze and
visualize the data in any way we see fit. For example we are able to generate
animations of the solved kinematics to visualize the results of the imposed
motion on the suspension.

<video autoplay loop mute controls poster="/assets/images/2023-02-05/ek-heave-animation.jpg">
  <source src="/assets/images/2023-02-05/ek-heave-animation.webm" type="video/webm">
  <source src="/assets/images/2023-02-05/ek-heave-animation.mp4" type="video/mp4">
</video>{:style="display: block; margin: 0 auto; max-width: 100%;"}

In the coming weeks, we will delve deeper into the kinematics of the front
suspension and present our findings from the analysis. Given the recent surge
in popularity of caster adjustable upper control arms and roll center adjustors
in the aftermarket, we will be especially interested in studying the need for
these modifications.

This is just the start of our suspension kinematics program. The rear
suspension is still a work in progress for reverse engineering and analysis. We
are always looking for ways to improve our workflow, and our goal is to
streamline our kinematics analysis workflow and to incorporate greater levels
of automation in the initial stages of the analysis, enabling us to study
different geometry scenarios with ease.

## Conclusion

Our suspension kinematics analysis of the Formula Delta EK20R front suspension
has provided valuable insights into the performance characteristics of the
vehicle. By reverse engineering the suspension and developing our own
kinematics workflow, we were able to obtain an understanding of the suspension
geometry and kinematic performance. This methodology, while demanding, is worth
the effort to develop the car.

At the professional level, having access to kinematic data is a necessity. We
believe this analysis highlights the potential for kinematics analysis to be
applied to all levels of motorsports. We are confident in our systematic
approach to vehicle development and hope to inspire others to do the same. We
look forward to sharing our findings and updates in the weeks to come.

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
[susprog-website]: http://susprog.com/
[lotus-shark-website]: https://www.lotusengineering.com/engineering-software/
[jupyter-website]: https://jupyter.org/
