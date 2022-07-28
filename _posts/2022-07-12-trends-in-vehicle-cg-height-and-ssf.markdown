---
layout: post
title: Trends in vehicle centre of gravity height and static stability factor from 1971 to 2020 using the NHTSA LVIPD and NCAP rollover stability measurements
date: 2022-07-28 10:00:00 -0400
categories: [data visualization]
---

{% include mathjax.html %}

Locating the vehicle centre of gravity is fundamental to vehicle dynamics. It
is a point that can be used to describe the motion of a rigid body when it
subjected to a resultant force. Its intrinsic effect on vehicle dynamic
performance makes it an primary consideration in chassis setup and design.

Obtaining vehicle centre of gravity data is difficult. Measuring the location
of the vehicle centre of gravity requires specialized equipment like a K&C
machine or a tilt table.

To overcome this challenge, we turn to historical data to inform an estimate. A
data driven approach may provide a viable approximation assuming that the
underlying architecture of passenger vehicles of today has not changed in the
past decades.

In this article, we will explore the National Highway and Traffic Safety
Administration's (NHTSA) Light Vehicle Inertia Parameter Database and the NCAP
Rollover Stability datasets to identify trends in vehicle centre of gravity
(CG) and static stability factor (SSF).

## Vehicle properties

The location of the centre of gravity is a point where the vehicle can be
analyzed as a particle. In a rotational analysis, the resultant moments about
the centre of gravity eliminates linear-rotational coupling components from the
equations of motion.

The vehicle centre of gravity is comprised of longitudinal, lateral and
vertical components. These components are defined as relative distances from an
axle, the vehicle centre plane and the ground respectively. The following
variables are used to describe these distances.

- Let $$a$$ represent the longitudinal distance of the vehicle CG from the front axle [m]
- Let $$b$$ represent the longitudinal distance of the vehicle CG from the rear axle [m]
- Let $$h$$ represent the vertical distance between the vehicle CG and the ground [m]

These values can also be presented in their non-dimensionalized form: weight
distribution, cross weight and static stability factor. The following variables
are used to describe these values.

- Let $$T_{avg}$$ represent the average track width of the front and rear axles [m]
- Let $$\textrm{SSF}$$ represent the static stability of the vehicle [-]
  - Where $$\textrm{SSF} = \frac{T_{avg}}{2h}$$

We will also make reference to the physical geometry to the vehicle,
specifically the roof height.

- Let $$H$$ represent the maximum vertical distance between the roof and the ground [m]

This analysis will focus on the factors influencing CG height and SSF. These
parameters are highly influential on vehicle dynamic performance and rollover
stability.

## Dataset

This study makes use of the NHTSA Light Vehicle Inertia Parameter Database and
the Rollover Stability Measurements for NCAP from years 2001 to 2020. Both
datasets are publicly available from their respective organizations. The
combined sanitized dataset consists of 1270 data points and includes model
years ranging from 1971 to 2021.

Within this analysis, we will refer to two segments of vehicles: cars and
trucks. The vehicle body styles in these segments are listed below.

- **Cars**: sedans, convertibles, coupes, hatchbacks and wagons
- **Trucks**: SUVs, pickup trucks, minivans and commercial vans

## Trends

<div class="info">
    <span class="material-icons" style="margin-right:0.25em">info</span>
    <div>
    <p>
    Charts are implemented using the data visualization library <a
    href="https://bokeh.org/">Bokeh</a>. The following tools are available in
    the toolbar, located on the right side of each chart.
    </p>
    <ul>
      <li>
        <div style="display: table-row">
          <div class="bk-root" style="display: table-cell; vertical-align: top">
            <div class="bk-tool-icon-box-zoom" style="width:24px; height:24px; background-size: 75% 75%; background-position: left center; background-repeat: no-repeat;">
            </div>
          </div>
          <div style="display: table-cell">
            <b>Box zoom</b> - click and drag to zoom into a rectangular region
          </div>
        </div>
      </li>
      <li>
        <div style="display: table-row">
          <div class="bk-root" style="display: table-cell; vertical-align: top">
            <div class="bk-tool-icon-wheel-zoom" style="width:24px; height:24px; background-size: 75% 75%; background-position: left center; background-repeat: no-repeat;">
            </div>
          </div>
          <div style="display: table-cell">
            <b>Wheel zoom</b> - scroll the mouse wheel to zoom in and out
          </div>
        </div>
      </li>
      <li>
        <div style="display: table-row">
          <div class="bk-root" style="display: table-cell; vertical-align: top">
            <div class="bk-tool-icon-reset" style="width:24px; height:24px; background-size: 75% 75%; background-position: left center; background-repeat: no-repeat;">
            </div>
          </div>
          <div style="display: table-cell">
            <b>Reset</b> - restores the plot ranges to their original values
          </div>
        </div>
      </li>
    </ul>
    <p>The charts include the following interactive features.</p>
    <ul>
      <li>
        <div style="display: table-row">
          <div class="bk-root" style="display: table-cell; vertical-align: top">
            <div class="bk-tool-icon-hover" style="width:24px; height:24px; background-size: 75% 75%; background-position: left center; background-repeat: no-repeat;">
            </div>
          </div>
          <div style="display: table-cell">
            <b>Tooltip on hover</b> - mouse over a data point to inspect 
          </div>
        </div>
      </li>
      <li>
        <div style="display: table-row">
          <span class="material-icons" style="display: table-cell; padding-right: 6px; padding-top: 2px; font-size: 18px; vertical-align: top">legend_toggle</span>
          <div>
            <b>Hide on click</b> - click the legend to hide vehicle types
          </div>
        </div>
      </li>
    </ul>
    For the best experience, <b>it is recommended to view this page on
    desktop</b>.
    </div>

</div>

### Centre of gravity height vs. vehicle mass

To begin our analysis, we will determine whether there is a correlation between
the centre of gravity height and the vehicle mass.

<div style="margin-bottom: 1em">
{% include 2022/07/12/centre-of-gravity-vs-weight-min.html %}
</div>

Two clusters are immediately apparent in this graph - cars and trucks. The
cluster for cars have a lower mean centre of gravity height than the cluster
for trucks. Centre of gravity height has a weak positive correlation with
vehicle mass for cars and a moderate positive correlation for trucks.

### Static stability factor vs. vehicle mass

In this chart, we get the first like-for-like comparison of the vehicle's
static rollover resistance. Static stability factor can be interpreted as the
lateral G a vehicle can sustain without tipping over.

<div style="margin-bottom: 1em">
{% include 2022/07/12/ssf-vs-weight-min.html %}
</div>

We can again see the clear clustering of cars and trucks, with cars typically
having a higher SSF than trucks. SSF has a slight positive correlation with
vehicle mass for cars, and has no correlation for trucks.

### Static stability factor vs. vehicle roof height to average track width ratio

Comparing static stability factor against the ratio between the vehicle roof
height and its average track width is interesting because of vehicle
eligibility rules for SCCA Solo events per section 3.1.A in the rule book. To
minimize the likelihood of a vehicle rollover, the SCCA stipulates that
competing vehicles must have a roof height to average track width ratio of less
than one. However, the Solo Events Board (SEB) may also use static stability
factor as an alternative to determine vehicle eligibility by requiring a SSF of
greater than 1.3.

<div style="margin-bottom: 1em">
{% include 2022/07/12/ssf-vs-roof-height-to-track-width-ratio-min.html %}
</div>

Roof height to average track width appears to be a valid proxy for rollover
stability. Static stability factor is negatively correlated with the roof
height to average track width ratio. All vehicles within the dataset that meet
the roof height to average track width ratio requirement have a static
stability factor of at least 1.2. This is short of the discretionary SSF
threshold of 1.3 as outlined in the SCCA Solo rule book. Consequently, this
means that vehicles that meet the roof height to average track width ratio
criteria are not guaranteed eligibility for these events.

### Centre of gravity of height vs. model year

In this chart, we shift our attention to see if there are any trends over time.
The jitter chart shows how the distribution of centre of gravity heights evolve
over time. It is also gives us some insight into the dataset itself.

<div style="margin-bottom: 1em">
{% include 2022/07/12/centre-of-gravity-vs-my-min.html %}
</div>

Much like the charts before, there is a clear difference in centre of gravity
height between cars and trucks. It is difficult to see any clear trends in
vehicle centre of gravity height with respect to time.

| Decade | Avg. CG Height, Cars [m] | Avg. CG Height, Trucks [m] |
| ------ | ------------------------ | -------------------------- |
| 1970s  | 0.524                    | 0.736                      |
| 1980s  | 0.542                    | 0.662                      |
| 1990s  | 0.530                    | 0.667                      |
| 2000s  | 0.545                    | 0.679                      |
| 2010s  | 0.553                    | 0.667                      |

The NHTSA Light Vehicle Inertial Parameter Database covers model years from
1971 through 1998, but is missing data for much of the 1990s. It is not until
2001 do we see regular CG height measurements published as part of the NCAP
lrogram.

### Static stability factor vs. model year

As advancements in technology are made over time, we would expect road vehicles
to become safer. Observing trends in static stability factor over time will
indicate if this is the case.

<div style="margin-bottom: 1em">
{% include 2022/07/12/ssf-vs-my-min.html %}
</div>

Industry appears to be taking an incremental approach to improving rollover
stability over time. This is markedly clear in the SUV segment. In the 1970s a
typical SUV would have an SSF of approximately 1.1. Today, the expectation
would be around 1.2 or greater. A similar observation could be made for cars.
This is great news for road safety and rollover prevention.

| Decade | Avg. SSF, Cars [-] | Avg. SSF, Trucks [-] |
| ------ | ------------------ | -------------------- |
| 1970s  | 1.337              | 1.100                |
| 1980s  | 1.343              | 1.138                |
| 1990s  | 1.355              | 1.144                |
| 2000s  | 1.397              | 1.178                |
| 2010s  | 1.407              | 1.225                |

### Average track width vs. model year

Static stability is increasing over time but centre of gravity height remains
stationary. This implies that vehicles are increasing in track width. We can
confirm this insight by looking for trends in average track width over time.

<div style="margin-bottom: 1em">
{% include 2022/07/12/track-width-vs-my-min.html %}
</div>

This chart shows that vehicle average track width is indeed increasing over
time, meaning that gains in SSF are primarily driven by making vehicles
physically larger as opposed to manufacturers designing for lower centre of
gravity heights.

| Decade | Avg. Track, Cars [m] | Avg. Track, Trucks [m] |
| ------ | -------------------- | ---------------------- |
| 1970s  | 1.402                | 1.617                  |
| 1980s  | 1.453                | 1.501                  |
| 1990s  | 1.436                | 1.524                  |
| 2000s  | 1.519                | 1.597                  |
| 2010s  | 1.552                | 1.632                  |

## Final comments

In this article, we identified trends in vehicle centre of gravity height and
static stability factor using a data set that spans over five decades. We
discovered clear clustering of the data based on vehicle classification,
specifically whether the vehicle was a car or a truck. An increasing trend in
static stability factor with respect to time is primarily driven by an increase
in vehicle track width.

For performance enthusiasts, choosing a vehicle with the highest possible
static stability factor is desirable to minimize the traction loss due to load
transfer and tire load sensitivity. For HPDE organizers, this dataset can be
used to validate the effectiveness of vehicle eligibility rules based on track
width and roof height.

The increasing trend in vehicle static stability factor is encouraging.
Regardless of whether your interest is in vehicle performance or road safety,
the trend is promising for the future of passenger vehicles.

## References

- Ginsberg, J. H. (1998). _Advanced engineering dynamics_. Cambridge University Press.
- _SCCA® National Solo® Rules_ (2022 Edition). (2022). Sports Car Club of America, Inc.
- Walz, M. C. (2005). _Trends in the static stability factor of passenger cars, light trucks, and vans_ (No. HS-809 868).
- Heydinger, G. J., Bixel, R. A., Garrott, W. R., Pyne, M., Howe, J. G., & Guenther, D. A. (1999). Measured vehicle inertial parameters-NHTSA's data through November 1998. _SAE transactions_, 2462-2485.
