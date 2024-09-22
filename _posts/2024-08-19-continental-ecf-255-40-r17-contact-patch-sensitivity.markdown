---
layout: post
title: "Static contact patch shape evolution of a 255/40R17 ultra-high performance 200TW tire - Continental ExtremeContact Force"
categories: [tires, interactive]
author: Kelvin Tse
date: 2024-09-21 20:55:00 -0400
---

<script type="module" src="/assets/dist/2024-09-18-continental-ecf-cp-widget/assets/index.js"></script>
<link rel="stylesheet" href="/assets/dist/2024-09-18-continental-ecf-cp-widget/assets/index.css" />

![Continental ExtremeContact Force hero image](/assets/images/2024-08-19/fdps-continental-ecf-sidewall-hero.jpg)

For the high performance driver education (HPDE) enthusiast, the choice of tire
has a major influence on your on-track performance. The ultra-high performance
tire segment offers a wide variety of options, each with their unique blend of
ultimate grip, wear resistance and value.

The Continental ExtremeContact Force is one of such tires. Released in 2021, it
is marketed as a ultra-high performance tire ideal for endurance racing. It is
jointly developed by Continental and Hoosier Tire, making it one of the first
known joint developments since Continental's acquisition of Hoosier Tire in 2016.

In the past, we used static contact patch measurements to characterize the
tire. [Our analysis of the Bridgestone Potenza RE-71R][1] means there is a data
point to compare and contrast their properties. Both have a UTQG rating of
200TW. However, the Bridgestone Potenza RE-71 is marketed as a ultra-high
performance tire designed for maximum on-track handling.

In this article, we analyze the static contact patch shape evolution of the
Continental ExtremeContact Force 255/40ZR17 98W XL to better understand the
characteristics of an ultra-high performance tire marketed to the endurance
HPDE enthusiast.

## Tire under test

### Continental ExtremeContact Force

For our testing, we used a new, unused Continental ExtremeContact Force tire in
size 255/40ZR17 98W XL mounted on a 9" wide rim. The tire was provided to us by
Adam Mann from [NUMMI Racing][2], a team competing Lucky Dog Racing Canada. The
following table summarizes all known specifications of the tire.

| Specification           | Value                               |
| ----------------------- | ----------------------------------- |
| **Manufacturer**        | Continental                         |
| **Model**               | ExtremeContact Force                |
| **Size**                | 255/40ZR17                          |
| **Load rating**         | 98W XL                              |
| **Date of manufacture** | May 2021                            |
| **DOT**                 | 1CP 032FDU                          |
| **Plies, sidewall**     | 2 polyester                         |
| **Plies, tread**        | 2 polyester + 2 steel + 1 polyamide |
| **UTQG Treadwear**      | 200                                 |
| **UTQG Traction**       | A                                   |
| **UTQG Temperature**    | A                                   |
| **Rim width**           | 9"                                  |

#### Application notes of interest

Continental provided application notes during a [launch webinar with
TrackDayTire.com][3]. These are the points of interest relevant to the study.

- The Continental ExtremeContact Force is marketed as an endurance tire.
- The Hankook Ventus R-S4 is noted as the competitive benchmark for this tire.
- Continental notes that the tire operates well with high static camber
  settings, citing good performance and durability on an BMW M4 GT4 with static
  camber set between -3 and -4 deg.

### Test schedule

The tire is evaluated at five inflation pressures, three inclination angles and
five vertical loads for a total of 5x3x5, or 75 measurements. The test
conditions are summarized in the table below.

| Test condition               | Value                           |
| ---------------------------- | ------------------------------- |
| **Inflation pressure** [PSI] | 24, 26, 28, 30, 34              |
| **Inclination angle** [deg]  | 0, 2, 4                         |
| **Vertical load** [lbs]      | -500, -800, -1000, -1200, -1400 |

## Data collection

Static contact patch shape is captured by producing an ink block print of the
tire. This technique consists of covering the tire with ink and making an
impression over a flat surface. This is like much like pressing a rubber stamp
onto a sheet of paper, with the tire being the stamp. This technique is
described in industry standard ASTM F870 for taking tread footprints of
passenger car tires.

Vertical load and inclination angle is controlled through the use of our
vertical rate tire dyno. The figure below shows the tire on the test rig. The
ink block prints were collected over two days in September 2021.

![Continental ExtremeContact Force on a test jig](/assets/images/2024-08-19/fdps-continental-ecf-testjig.jpg)

The end result of the data collection is a series of ink block prints, each
representing a unique condition. The ink block prints are digitized onto a
computer and sanitized for analysis. The figure below shows all 75 footprints
collected for this study.

![All footprints collected from the Continental ExtremeContact Force](/assets/images/2024-08-19/fdps-continental-extremecontact-force-tire-255-40r17-all-samples.png)

This process is quite labour intensive, so being able to see all the footprints
in one place allows us appreciate the work that went into it.

### Try it yourself!

The widget below allows you to manipulate the vertical load, inclination angle
and inflation pressure to generate a tire footprint. Move the sliders and watch
how the shape changes!

<div id="footprint-shape-widget"></div>

This visualization uses a machine learning model based on a constrained
variational auto encoder (CVAE) topology with convolutional layers. The model
is trained using the footprints collected in the previous section. Latent
vectors are generated by a small feed-forward neural network.

## Analysis

With all the data collected, we can now analyze the footprints.

In each of the measurements, you will see two charts - a line chart and a heat
map. The line chart is useful to visualize the magnitude of the changes,
whereas the heat map is useful to see the relative trends across two
dimensions. These are just two different ways of visualizing the same data.

For the majority of the analysis, we follow the sign convention from the SAE
J670 tire axis system.

### Length

The contact patch length is the fore and aft distance of the footprint. It is
measured by fitting a bounding box around the footprint.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 0 20px 0; max-width: 900px">
    <img src="/assets/images/2024-08-19/FDPS - Continental ExtremeContact Force 255-40ZR17 98W XL 9 rim - length.png" alt="Chart of contact patch length" width="100%">
  </div>
</div>

The contact patch length clearly elongates as the inclination angle increases.
Inspecting the individual footprints reveals that the contact patch distorts
into a trapezoidal shape causing the contact patch to lengthen.

### Width

The contact patch length is the side to side distance of the footprint. It is
measured by fitting a bounding box around the footprint.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 0 20px 0; max-width: 900px">
    <img src="/assets/images/2024-08-19/FDPS - Continental ExtremeContact Force 255-40ZR17 98W XL 9 rim - width.png" alt="Chart of contact patch width" width="100%">
  </div>
</div>

At zero degrees of inclination, the contact patch width is insensitive to
inflation pressure. Inspecting the individual footprints shows good tread
engagement of the shoulders. This may be a design choice related to tread wear
and thermal management.

The contact patch width becomes more sensitive to inflation pressure when an
inclination angle is introduced. This is most visible at four degrees of
inclination. The loss of tread width at -500 lbs is due to the tire not making
full contact with the ground.

### Aspect ratio

The contact patch aspect ratio describes the relative shape of the footprint.
In this analysis, it is computed as the ratio between the contact patch length
and the contact patch width.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 0 20px 0; max-width: 900px">
    <img src="/assets/images/2024-08-19/FDPS - Continental ExtremeContact Force 255-40ZR17 98W XL 9 rim - aspect.png" alt="Chart of contact patch aspect ratio" width="100%">
  </div>
</div>

As part of their launch webinar, Continental states that the tire is
insensitive to camber. This is based on their testing in a number of endurance
racing events.

This may be due to the reduced sensitivity of the aspect ratio at high
inclination angles. At four degrees of inclination, the contact patch becomes
increasingly square and insensitive to load. In other words, the contact patch
shape becomes relatively consistent, with the length and width increasing and
decreasing in proportion to each other.

### Gross area

The gross contact patch area is the area of the footprint encapsulated by a
convex hull. This is the contact area if there was no tread pattern.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 0 20px 0; max-width: 900px">
    <img src="/assets/images/2024-08-19/FDPS - Continental ExtremeContact Force 255-40ZR17 98W XL 9 rim - gross area.png" alt="Chart of contact patch gross area" width="100%">
  </div>
</div>

The four degree inclination measurements show a disadvantage in gross area. The
two and zero degree inclination conditions are comparable, though there is a
slight advantage at two degrees.

### Net area

The net contact area is the area in which the tire makes contact with the road
surface. It is measured by calculating the area of ink in the footprint.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 0 20px 0; max-width: 900px">
    <img src="/assets/images/2024-08-19/FDPS - Continental ExtremeContact Force 255-40ZR17 98W XL 9 rim - net area.png" alt="Chart of contact patch net area" width="100%">
  </div>
</div>

The net contact area is similar to the gross area measurements, though the
advantage at two degrees inclination is slightly more pronounced at high loads.

### Void ratio

Given the gross area and net contact area, the void ratio can be calculated. It
is calculated as one minus the ratio between the net contact area and the gross
footprint area.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 0 20px 0; max-width: 900px">
    <img src="/assets/images/2024-08-19/FDPS - Continental ExtremeContact Force 255-40ZR17 98W XL 9 rim - void ratio.png" alt="Chart of contact patch void ratio" width="100%">
  </div>
</div>

Much like in our analysis of the Bridgestone Potenza RE-71R, there is not much
significance in the trends here. The average void ratio across all conditions
is 0.29.

### Load sensitivity

In this chart, we revisit some of the previous measurements but assess the load
sensitivity as opposed to their absolute values. Sensitivities are measured as
the difference between two parameters. The figure below shows the sensitivity
of the contact patch length, width and gross area per 100 lbs of vertical load.
The sensitivities are averaged across all inflation pressures.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
  <div style="margin: 0 auto; padding: 0 0 20px 0; max-width: 800px">
    <img src="/assets/images/2024-08-19/FDPS - Continental ExtremeContact Force 255-40ZR17 98W XL 9 rim - load sensitivity.png" alt="Chart of contact patch void ratio" width="100%">
  </div>
</div>

Of the three measurements, the contact patch width load sensitivity is the most
clear. Contact patch width is the least sensitive at high loads and low
inclinations, and the most sensitive at low loads and high inclinations. This
is likely attributable to the tire not making full contact with the road
surface at high inclination angles.

While the load sensitivity of the contact patch length and gross area are less
clear, it is worth mentioning that the load sensitivity behaviour at high loads
is completely different than the Bridgestone Potenza RE-71R. Where the
Continental ExtremeContact Force becomes insensitive at low inclination angles,
the Bridgestone Potenza RE-71R becomes more sensitive.

## Discussion

Our analysis of the Continental ExtremeContact Force benefits from having a
data point to compare against, specifically against the [Bridgestone Potenza
RE-71R which we evaluated in October 2021][1]. Although both tires share a
200TW UTQG rating, they have very different performance objectives. The
Continental ExtremeContact Force is focused on durability, whereas the
Bridgestone Potenza RE-71R is focused on ultimate grip.

Based on our analysis and our experience in the laboratory, these are the
noteworthy findings related to the Continental ExtremeContact Force.

- Compared to the Bridgestone Potenza RE-71R, the contact patch shape resembles
  a rectangle as opposed to a football. This is likely due to the tread radius,
  with the Bridgestone Potenza RE-71R having a more curved profile, akin to a
  motorcycle tire, and the Continental ExtremeContact Force having a more
  square profile.
- The squared shape of the tread radius results in reduced inflation pressure
  sensitivity of the contact patch width. There is good engagement of the tread
  especially near the shoulders at zero and two degrees of inclination. This
  design may be related to durability and thermal management since most of the
  heat and wear occurs near the shoulders.
- The guidance for running high static camber may be driven by the elongation
  of the contact patch length and the squaring of the contact patch aspect
  ratio. However, this comes at a slight penalty to contact area, with a
  reduction in gross footprint area and net contact area going from two to four
  degrees of inclination.
- The load sensitivity at high loads is completely different than the
  Bridgestone Potenza RE-71R, with the Continental ExtremeContact Force showing
  low sensitivity at low inclination angles and the Bridgestone Potenza RE-71R
  showing low sensitivity at high inclination angles. Consequently, it is
  likely that each tire will require different static alignment strategies to
  maximize their performance potential.

Although we were able to evaluate the Continental ExtremeContact Force the
laboratory, we have not had the chance to drive with these tires to assess
their on-track performance.

## Acknowledgements

This analysis is made possible with the help of the following individuals:

- **Adam Mann** from [NUMMI Racing][3] supplied us with the Continental
  ExtremeContact Force tire used in this study. Availability of this tire was
  limited at the time of launch, so we greatly appreciate Adam letting us to
  borrow a set to bring into the laboratory.
- **Ping Zhang** from [Formula Delta Performance Solutions][4] performed the
  the data collection of the footprints seen in the study. It is a labour
  intensive task that should not go unrecognized!

## Conclusions

The automotive pneumatic tire is a sophisticated engineered product.
Manufacturers share very little data to describe the performance of their
tires. Consumer reviews focus on on-track tests that are often unreproducible
by the purchaser due to variations in the vehicle, driver and test conditions.

Direct measurement of tire performance via force & moment testing is
unfortunately not practical or feasible for the individual. Thus, we must rely
on other objective markers that are known to be correlated with tire
performance.

Our evaluation of the Continental ExtremeContact Force is a continuation of our
research into tire engineering. The conventional approach in vehicle dynamics
is to take a high-level view of the tire and abstract away the structural
details of the tire. This approach is not possible without access to tire force
& moment data. Given these constraints, we approach the problem from the
opposite direction.

By comparing the Continental ExtremeContact Force with the Bridgestone Potenza
RE-71R, it becomes apparent how the two products are differentiated. If you
have enjoyed our analysis, send us a message on [Facebook][5] or
[Instagram][4]. If you work in the tire engineering field, we would love to
hear from you on how we can improve our analysis.

## References

1. Milliken, William F., and Douglas L. Milliken. 1995. Race Car Vehicle Dynamics. Warrendale, PA, U.S.A: SAE International.
1. Gent, A. N., & Walter, J. D. (2006). Pneumatic tire. National highway traffic safety administration.
1. Rodgers, Brendan. 2021. Tire Engineering: An Introduction. First edition. Boca Raton: CRC Press/Taylor & Francis Group.

[1]: /jekyll/update/2021/10/06/re71r-255-40-r17-tire-static-footprints.html
[2]: https://www.instagram.com/nummi_racing/
[3]: https://www.youtube.com/watch?v=CEfXz6pAVTk
[4]: https://www.instagram.com/formula.delta/
[5]: https://www.facebook.com/FormulaDeltaConsult
