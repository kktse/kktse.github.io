---
layout: post
title: Estimating vehicle inertia and centre-of-gravity height using the NHTSA light vehicle inertial parameter database
categories: [data visualization]
---

{% include mathjax.html %}

_PREFACE: this page is best experienced on desktop_

Vehicle dynamic simulation relies on having known information about the
vehicle under study. Vehicle mass and inertial properties are required for
any meaningful handling simulation. These values are non-trivial to obtain
and makes use of highly specialized equipment to measure. Without access to a
kinematics and compliance machine or an inertia measurement rig, vehicle
dynamic simulation is out-of-reach to most individuals outside of the
automotive industry.

From 1992 to 1998, the National Highway Traffic Safety Administration (NHTSA)
published a series of papers with a database of measured mass and inertial
properties for light passenger vehicles. Given that the underlying
architecture of the modern light vehicle has not fundamentally changed, we
can use this information to identify trends in the data to better inform an
estimation of mass and inertial properties of a given vehicle.

## Vehicle properties

The mass properties of a four-wheeled vehicle typically refer to its mass and
the position of its centre-of-gravity (CG). We will assume that the lateral
position of the CG lies along the XZ-plane (ie. the vehicle centre plane).
This yields four parameters of interest.

* The vehicle mass, $$m$$ in [$$kg$$]
* The longitudinal distance from the CG to the front axle, $$a$$ in [$$m$$]
* The longitudinal distance from the CG to the rear axle, $$b$$ in [$$m$$]
* The vertical distance from the CG to the ground, $$h$$ in [$$m$$]

Of the four parameters, only the vertical distance from the CG height to the
ground (simply known as the CG height) is difficult to obtain. The remaining
properties can be measured using a set of floor scales. Consequently, we will
limit our discussion to focus on estimating the vehicle CG height.

The mass moment of inertia properties of an object can be described by a
tensor, $$I$$. In matrix form:

$$
I =
\begin{bmatrix}
I_{xx} & I_{xy} & I_{xz} \\
I_{yx} & I_{yy} & I_{yz} \\
I_{zx} & I_{zy} & I_{zz} \\
\end{bmatrix}
=
\begin{bmatrix}
I_{xx} & 0 & I_{xz} \\
0 & I_{yy} & 0 \\
I_{zx} & 0 & I_{zz} \\
\end{bmatrix}
$$

The diagonal terms represent the moments of inertia. The off-diagonal terms
represent the products of inertia. Because we assume the vehicle is symmetric
along the XZ-plane, we can set $$I_{xy} = 0$$ and $$I_{yz} = 0$$. This leaves
us with four inertial parameters of interest.

* The roll inertia, $$I_{xx}$$ in [$$kg \cdot m^2$$]
* The pitch inertia, $$I_{yy}$$ in [$$kg \cdot m^2$$]
* The yaw inertia, $$I_{zz}$$ in [$$kg \cdot m^2$$]
* The roll/yaw product of inertia, $$I_{xz}$$ in [$$kg \cdot m^2$$]

All four inertial parameters are non-trivial to obtain and will be in scope
of our discussion.

## Data treatment

The NHTSA Light Vehicle Inertial Parameter Database contains measurements for
a variety of different passenger vehicles in different loading loading
conditions. Measurements that have ballast are excluded. If duplicate entry
is found for a vehicle, only the first measurement is kept.

The database provides a vehicle type code to describe the chassis style.
Unfortunately, no key is provided for type code in the database. The best
guess legend key and sample vehicles are shown below.

* **4S** - four door sedan - _1987 Ford Tempo, 1991 Honda Accord LX_
* **2S** - two door sedan - _1998 Chevrolet Metro, 1986 BMW 325i_
* **SW** - station wagon - _1979 Datsun 210, 1986 Buick Century Estate_
* **PU** - pick up truck - _1986 Chevrolet S-10 Pickup, 1998 Toyota Tacoma_
* **VN** - minivan - _1992 Dodge Caravan, 1991 Toyota Previa LE_
* **MP** - "multi-purpose" SUV - _1983 Chevrolet S-10 Blazer, 1998 Toyota 4Runner_
* **3H** - three door hatchback - _1991 Geo Metro, 1986 Mazda 323_
* **5H** - five door hatchback - _1983 Dodge Omni, 1983 Toyota Camry_
* **2C** - two door coupe - _1986 Toyota MR2, 1989 Pontiac Grand Am_

## Trends

With data from the NHTSA Inertial Parameter Database, we can observe trends
with respect to vehicle mass. To begin, we will assess trends in vehicle
centre of gravity height.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
<div style="margin: 0 auto; padding: 0 20px 20px 20px; max-width: 1000px">
{% include 2020/10/25/nhtsa-ipdb-cg-m.html %}
</div>
</div>

From this graph, we can see that the CG is likely to be higher in heavier
vehicles. Observe the clustering of cars and trucks; trucks and SUVs tend to
have a higher CG where the CG height increases faster with vehicle mass than
cars. The table below summarizes the results of the linear regression.

<div style="overflow-x: auto" markdown="block">

| Dataset      | Transfer Function      | R-Squared | Count |
| ------------ | ---------------------: | --------: | ----: |
| All Vehicles | y = 0.00018x + 0.34338 | 0.723     | 204   |
| Cars         | y = 0.00005x + 0.46983 | 0.405     | 73    |
| Trucks       | y = 0.00014x + 0.40760 | 0.631     | 131   |

</div>

Next, we will assess the vehicle inertial properties. All four inertial
parameters ($$I_{xx}$$, $$I_{yy}$$, $$I_{zz}$$ and $$I_{xz}$$) are shown in
the graph below. Note that the roll/yaw product contains fewer data points.
This is because only a select number of vehicles have the roll/yaw product
measured.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
<div style="margin: 0 auto; padding: 0 20px 20px 20px; max-width: 1000px">
{% include 2020/10/25/nhtsa-ipdb-inertia-m.html %}
</div>
</div>

The moments of inertia have good correlation with vehicle mass in
consideration of all vehicle types. The relationship starts to diverge with
higher vehicle mass, especially between minivans and SUVs. The roll/yaw
product will likely be positive for most vehicles with the exception of
pickup trucks. There is some correlation for cars but that relationship is
weak. The results are summarized in the table below.

<div style="overflow-x: auto" markdown="block">

| Dataset      | Parameter  | Transfer Function    | R-Squared | Count |
| ------------ | ---------- | -------------------: | --------: | ----: |
| All Vehicles | Roll, $$I_{xx}$$ | y = 0.566x - 276.379 | 0.836     | 204   |
| Cars         | Roll, $$I_{xx}$$ | y = 0.497x - 181.445 | 0.857     | 73    |
| Trucks       | Roll, $$I_{xx}$$ | y = 0.609x - 355.532 | 0.760     | 131   |
| All Vehicles | Pitch, $$I_{yy}$$ | y = 2.978x - 1697.108| 0.834     | 204   |
| Cars         | Pitch, $$I_{yy}$$ | y = 3.079x - 1728.758| 0.913     | 73    |
| Trucks       | Pitch, $$I_{yy}$$ | y = 3.182x - 2107.468| 0.751     | 131   |
| All Vehicles | Yaw, $$I_{zz}$$ | y = 2.961x - 1596.431| 0.845     | 204   |
| Cars         | Yaw, $$I_{zz}$$ | y = 3.176x - 1754.164| 0.920     | 73    |
| Trucks       | Yaw, $$I_{zz}$$ | y = 3.168x - 2021.319| 0.770     | 131   |
| All Vehicles | Roll/yaw, $$I_{xz}$$ | y = 0.049x - 13.996  | 0.078     | 41   |
| Cars         | Roll/yaw, $$I_{xz}$$ | y = 0.060x - 10.578  | 0.627     | 10    |
| Trucks       | Roll/yaw, $$I_{xz}$$ | y = 0.078x - 75.000  | 0.098     | 31   |

</div>

## Static stability factor (SSF)

The static stability factor (SSF) is used as a measure of rollover resistance based
on static vehicle properties. It is defined as:

$$ SSF = \frac{T}{2h}$$

Where $$T$$ is the average vehicle track and $$h$$ is the centre of gravity
height from the ground. A higher static stability factor indicates higher
resistance to vehicle rollover. It is convenient to describe the vehicle CG
height in terms of its SSF because it is non dimensionalized to the vehicle
geometry. The trend in static stability factor is shown in the graph and
histogram shown below.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
<div style="margin: 0 auto; padding: 0 20px 20px 20px; max-width: 1000px">
{% include 2020/10/25/nhtsa-ipdb-ssf-m.html %}
</div>
</div>

There is a weak negative correlation between SSF and vehicle mass when
considering all vehicle types. Upon further inspection, this is because of
the clustering of cars and trucks. Trucks and SUVs tend to have a lower SSF
whereas cars tend to have a higher SSF.

<div style="overflow-x: auto" markdown="block">

| Static Stability Factor (SSF) | All Vehicles | Cars | Trucks |
| ------ | -----------: | ---: | -----: |
| **Mean**   | 1.212 | 1.341 | 1.140 |
| **Min**    | 0.964 | 1.220 | 0.964 |
| **25th percentile** | 1.110 | 1.310 | 1.079 |
| **50th percentile** | 1.220 | 1.342 | 1.128 |
| **75th percentile** | 1.316 | 1.378 | 1.211 |
| **Max**    | 1.478 | 1.435 | 1.478 |
| **Count**  | 204   | 73    | 131   |

</div>

### Dynamic indices

The dynamic index (DI) is a non dimensionalized value used to describe the
inertial properties of the vehicle. The yaw dynamic index dates back to the
1930s with the $$k^2$$ experiments conducted by Olley. The yaw dynamic index
defined as:

$$DI_{yaw} = \frac{k_z^2}{ab}$$

Where:

* $$k_z$$ is the yaw radius of gyration [$$m$$]
* $$a$$ is the longitudinal distance from the CG to the front axle [$$m$$]
* $$b$$ is the longitudinal distance from the CG to the rear axle [$$m$$]

The following equation shows the relationship between the yaw radius of
gyration and the yaw inertia. Rearranging this relation for $$I_{zz}$$
completes the relationship between DI and inertia.

$$k_z^2 = \frac{I_{zz}}{m}$$

The same concept can be applied to the pitch inertia to find the pitch
dynamic index.

$$DI_{pitch} = \frac{k_y^2}{ab}$$

Applying such index for roll is not common. From experimentation, the
following equation normalizes the roll inertial measurements. Note that this
equation is completely arbitrary and is not based on any literature.

$$DI_{roll} = \frac{k_y}{T}$$

Where $$T$$ is the average track width. The trends in dynamic indices are
shown in the graphs and histograms below.

<div style="left: 50%; margin-left: -50vw; margin-right: -50vw; max-width: 100vw; position: relative; right: 50%; width: 100vw;">
<div style="margin: 0 auto; padding: 0 20px 20px 20px; max-width: 1000px">
{% include 2020/10/25/nhtsa-ipdb-di-m.html %}
</div>
</div>

Notice how all of the dynamic indices are weakly correlated with vehicle
mass. These values are better described by its average since they are centred
around some value. The results are shown in the tables below.

<div style="overflow-x: auto" markdown="block">

| Roll Dynamic Index   | All Vehicles | Cars | Trucks |
| ------               | -----------: | ---: | -----: |
| **Mean**             | 0.413 | 0.409 | 0.415 |
| **Min**              | 0.367 | 0.378 | 0.367 |
| **25th percentile**  | 0.399 | 0.399 | 0.399 |
| **50th percentile**  | 0.409 | 0.408 | 0.412 |
| **75th percentile**  | 0.423 | 0.415 | 0.427 |
| **Max**              | 0.512 | 0.471 | 0.512 |

</div>

<div style="overflow-x: auto" markdown="block">

| Pitch Dynamic Index  | All Vehicles | Cars | Trucks |
| ------               | -----------: | ---: | -----: |
| **Mean**             | 1.004 | 1.042 | 0.982 |
| **Min**              | 0.816 | 0.831 | 0.816 |
| **25th percentile**  | 0.927 | 0.977 | 0.908 |
| **50th percentile**  | 0.998 | 1.061 | 0.963 |
| **75th percentile**  | 1.078 | 1.095 | 1.038 |
| **Max**              | 1.298 | 1.225 | 1.298 |

</div>

<div style="overflow-x: auto" markdown="block">

| Yaw Dynamic Index   | All Vehicles | Cars | Trucks |
| ------              | -----------: | ---: | -----: |
| **Mean**            | 1.034 | 1.091 | 1.002 |
| **Min**             | 0.837 | 0.914 | 0.837 |
| **25th percentile** | 0.962 | 1.037 | 0.932 |
| **50th percentile** | 1.033 | 1.105 | 1.000 |
| **75th percentile** | 1.111 | 1.148 | 1.055 |
| **Max**             | 1.242 | 1.242 | 1.190 |

</div>

<div style="overflow-x: auto" markdown="block">

| Metric   | All Vehicles | Cars | Trucks |
| ------              | -----------: | ---: | -----: |
| **Count**            | 204   | 73    | 131   |

</div>

## Discussion

Based on the findings from the 1998 NHTSA Light Vehicle Inertial Parameters
Database, vehicles tend to have similar dynamic indices and static stability
factors. The average values can be used to estimate the vehicle's centre of
gravity height and inertial properties using data that is easily obtainable.
For cars, the average values are:

* **Static stability factor**: 1.341
* **Roll dynamic index**: 0.409
* **Pitch dynamic index**: 1.042
* **Yaw dynamic index**: 1.091

The roll/yaw product can be estimated using the transfer function with
respect to vehicle mass. Note that this is subject to greater uncertainty
because of the limited number of measurements and the weak correlation
observed in the data.

## Final comments

Vehicle dynamic simulation is contingent on having data on your vehicle.
Centre of gravity position and inertial properties are some of the most basic
pieces of information needed parameterize the car. With public databases and
journals, one can identify trends in the industry to make a reasonable guess
of a vehicle's centre of gravity position and inertial properties.

This analysis identified average values for the static stability factor and
the dynamic indices. These values are non dimensionalized to the vehicle
geometry like track width and weight distribution. Manufacturers typically
publish vehicle geometry data, making the calculation simple to do. This
enables anyone to obtain reasonable values for the centre of gravity height
and inertia without needing expensive measurement equipment.

The Light Vehicle Inertial Parameters Database is available from the NHTSA [here](https://www.nhtsa.gov/DOT/NHTSA/NRD/Multimedia/PDFs/VRTC/ca/nhtsa_inertia_database_metric.pdf).

## References

1. Heydinger, Gary J., Ronald A. Bixel, W. Riley Garrott, Michael Pyne, J. Gavin Howe, and Dennis A. Guenther. "Measured vehicle inertial parameters-NHTSA's data through November 1998." SAE transactions (1999): 2462-2485.
1. Walz, M. C. (2005). Trends in the static stability factor of passenger cars, light trucks, and vans (No. HS-809 868).
1. Basso, G. L. (1974). Functional derivation of vehicle parameters for dynamic studies (No. LTR-ST. 747).
1. Gillespie, T. D. (1992). Fundamentals of vehicle dynamics (Vol. 400). Warrendale, PA: Society of automotive engineers.
