---
layout: post
title: slvstopy - a Python library to read SolveSpace drawings
date: 2020-05-19 22:15:00 -0400
categories: jekyll update
---

[`slvstopy`](https://github.com/kktse/slvstopy) is a Python library for
reading [SolveSpace](https://solvespace.com/index.pl) drawings as a
[`python-solvespace`](https://github.com/KmolYuan/solvespace/tree/python/cython)
system.

## Motivation

This library addresses the need to analyze complex 3D mechanisms.
[SolveSpace](https://solvespace.com/index.pl) is a parametric 3d CAD tool
with a graphical 3d modelling interface.
[SolveSpace](https://solvespace.com/index.pl) provides basic analysis tools;
however, it is not flexible enough for complex 3d mechanisms. The
[`python-solvespace`](https://github.com/KmolYuan/solvespace/tree/python/cython)
project adds Python bindings to the SolveSpace geometric constraint solver.
Analyzing a mechanism in Python enables analysis using popular libraries
such as
[`sympy.geometry`](https://docs.sympy.org/latest/modules/geometry/index.html).

## Use Case - Suspension Kinematics

Kinematic analysis of an automotive suspension consists of four parts:

1. Constraining the mechanism
1. Solving a geometric constraint problem
1. Post-process the results
1. Automotive specific analysis

The [`slvstopy`](https://github.com/kktse/slvstopy) library aids in solving
the geometric constraint problem such that the solution can be post-processed
outside of [SolveSpace](https://solvespace.com/index.pl).

Constraining the mechanism can be unintuitive, especially when the constraints
are not initially known. This process can be aided through the use of a 3d
CAD package. The SolveSpace graphical user interface makes it easy to draw and
visualize the mechanism.

When the suspension mechanism is complete, the `*.slvs` file can be read as a
[`SolverSystem`](https://pyslvs-ui.readthedocs.io/en/stable/python-solvespace-api/#solversystem).

```python
from slvstopy import Slvstopy

slvs_to_py = Slvstopy(file_path="macpherson-strut.slvs")
system, entities = slvs_to_py.generate_system()
```

Constraints and parameters can be updated to articulate the mechanism. Entity
IDs are retrieved by inspecting the `*.slvs` file in a text editor.

```python
from python_solvespace import Entity

# Example of adding a constraint
wheel_entity_id = "00040000"
xy_plane_entity_id = "00010000"
system.distance(
    entities[wheel_entity_id],
    entities[xy_plane_entity_id],
    100,
    Entity.FREE_IN_3D,
)

# Example of updating a parameter
steering_rack_entity_id = "00050000"
system.set_params(
    entities[steering_rack_entity_id],
    (-75.2, 311.9, -29.1),
)
```

The mechanism is now ready to be solved.

```python
from python_solvespace import ResultFlag

result = system.solve()
assert result == ResultFlag.OKAY
```

If the result flag returns
[`ResultFlag.OKAY`](https://pyslvs-ui.readthedocs.io/en/stable/python-solvespace-api/#resultflag),
the solver successfully converged. The updated position of a point can be
retrieved.

```python
endlink_entity_id = "00060000"
endlink_position = system.params(entities[endlink_entity_id].params)
```

## Caveats

* Groups are not supported; mechanisms must be in a single sketch
* Requests are not supported
* Not all entities and constraints are supported
* Certain constraints may cause instability; avoid dimensioning from the reference planes, use 'dragged' constraints where possible

## Benefits

* Single source of truth (`*.slvs` file)
* Can use SolveSpace 3d modelling tools to develop and constrain the mechanism
* Can use other Python libraries to post-process results

---

_*Based on [7d3015](https://github.com/kktse/slvstopy/commit/7d3015b5834adf06a165725d69a2a0aa6f0b0efa) at the time of writing_