---
layout: post
title:  "OTA 2018 Debrief: Understeer Gradient Test"
date:   2018-12-01 17:05:00 -0400
categories: jekyll update
---

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML">
</script>

> 2019/08/22 update: this article is part of a series on on-centre vehicle
> handling using linear system analysis. For further reading, please feel free
> to check out my other posts:
> 1. [Lateral Dynamics of a Linear Single-Track Vehicle](/jekyll/update/2018/09/18/single-track-bicycle.html)
> 1. **[OTA 2018 Debrief: Understeer Gradient Test](/jekyll/update/2018/12/01/understeer-gradient-identification.html)**
> 1. [OTA 2018 Debrief: Cornering Compliances and Transients](/jekyll/update/2019/01/06/cornering-compliance-identification.html)
> 1. [OTA 2018 Debrief: On-Centre Vehicle Handling](/jekyll/update/2019/02/13/on-centre-handling-metrics.html)
> 1. [OTA 2018 Debrief: Parameter Analysis](/jekyll/update/2019/03/17/parameter-sensitivity-analysis.html)
> 1. [Cornering Compliances of a Typical Road Vehicle](/jekyll/update/2019/06/01/typical-cornering-compliances.html)


***
&nbsp;

![ddt_civicsi](/assets/images/2018-12-01/ddt_c551_civic_si_banner.jpg)

Welcome to the Ontario Time Attack debrief files, a series of articles where we
answer vehicle dynamics questions we always wanted to ask, but didn't have the
chance to tackle during the season. In this instalment, we perform an
understeer gradient test to get an objective measure of vehicle handling.

# Understeer, Defined
The tendency for a vehicle to require more (or less) steering input relative to
the Ackermann steer angle is a measure of understeer. The gain due to lateral
acceleration is the understeer gradient.

$$\delta = \frac{L}{R} + K a_y$$

Where:
* $$\delta$$ is the steering angle [rad]
* $$L$$ is the wheelbase of the car [m]
* $$R$$ is the radius of the turn [m]
* $$a_y$$ is the lateral acceleration [m/s<sup>2</sup>]
* $$K$$ is the understeer gradient [rad/m/s<sup>2</sup>]

Understeer can be measured by means of an understeer gradient test. For our
purposes, we perform a constant speed test whereby the vehicle is kept at a
constant forward speed and the steering slowly ramped to full lock.

The instantaneous path radius is calculated using circular motion.
Differentiating the understeer equation and linearizing about zero lateral
acceleration yields the on-centre understeer gradient.

$$K = \frac{d\delta}{da_y}\biggr\rvert_{a_y=0} - \frac{L}{V^2}$$

Where:
* $$V$$ is the forward speed of the vehicle [m/s]

We assume that the forward speed of the vehicle is constant. The understeer
gradient can be computed if the lateral acceleration, forward speed and
steering angle can be measured.

# Experimental Setup
![tmp_civicsi](/assets/images/2018-12-01/tmp_c551_civic_si.jpg)

The target vehicle is a 2012 Honda Civic Si Coupe equipped with adjustable
coilovers, staggered wheel sizing, bucket racing seat and roll bar. All data is
collected with an Autosport Labs RaceCapture/Pro Mk2 data acquisition
system. The data acquisition system is connected to the vehicle via the
diagnostics port.

The constant speed understeer gradient test is performed on a flat testing area
of a race track. This test is performed off the active track and in a
designated testing area. _Pedestrian and occupant safety is of utmost
importance. Do not perform this test in an uncontrolled area._

A test speed of 30 km/h is chosen for safety purposes. This speed is relatively
low compared to most on-track maneuvers; however, a low speed test reduces the
likelihood of a loss-of-control. _At no time did the vehicle operate outside
the scope of driver control and at no time did the driver operate the vehicle
in an unsafe manner._

The test is performed immediately after leaving the active track such that the
tire temperatures and tire pressures are similar to those seen in racing
conditions.

# Analysis
We begin the vehicle analysis by declaring all known constants:

* $$L = 2.62$$ [m]
* $$V = 30.0$$ [km/h]

With the wheelbase and forward speed known, the Ackermann steer angle can be
computed.

The next step is to identify the slope of the steering angle vs. lateral
acceleration. The slope at zero lateral acceleration is approximated by
performing a first-order polynomial fit about ±0.5 g.

![usg_graph](/assets/images/2018-12-01/usg_test.png)

The slope of the first-order polynomial fit yields the necessary value to
evaluate the understeer gradient.

* $$\frac{d\delta}{da_y}\biggr\rvert_{a_y=0} = 27.7$$ [deg/g]

Substituting these values into the understeer gradient equation yields the
following:

$$K = 5.5$$ [deg/g]

# Summary
The purpose of performing the understeer gradient test is to obtain an
objective measure of the vehicle's handling characteristics. The understeer
gradient test is easy to conduct, and with modern on-board diagnostics systems
very little specialized instrumentation is required. While not a comprehensive
measure of vehicle handling, it provides a data point for comparison.

_A big thank you to OTA competitor Joseph Yang in the #551 2012 Honda Civic Si
for performing the understeer gradient test and for providing the data used the
analysis. This article would not be possible without the support of Joseph Yang
and his sponsors._

# References
1. Milliken, William F., and Douglas L. Milliken. _Race car vehicle dynamics_. Vol. 400. Warrendale: Society of Automotive Engineers, 1995.
2. Dixit, Neha R. _Evaluation of Vehicle Understeer Gradient Definitions_. Diss. The Ohio State University, 2009. 
