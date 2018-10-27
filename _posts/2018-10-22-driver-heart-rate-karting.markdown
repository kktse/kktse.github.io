---
layout: post
title:  "Driver Heart Rate Monitoring with a Smartwatch"
date:   2018-10-25 22:00:00 -0400
categories: jekyll update
---

![Goodwood](/assets/images/2018-10-25/goodwoodlupusgp18.jpg)

Race driving is an activity that affects an individual's physiology. This
experience is not universal and can affect people in different ways. With a
wearable heart rate monitor, we can measure this response before, during and
after a race. Understanding this response can help develop a driver routine
that improves in-vehicle performance.

Methodology
===========
The purpose of this investigation is to determine if a physiological response
can be observed during a race event. Heart rate is used as a general measure of
arousal. This measurement is selected due to its availability in consumer-grade
smartwatches and fitness tracking devices.

The investigation follows an amateur driver during the 2018 Lupus Grand Prix, a
four-person team endurance fundraising race hosted at Goodwood Kartways.  The
measurement period tracks the driver's heart rate before, during, and after
their stint. The driver drove the second stint for a period of 22 minutes.

Heart rate is measured using an Amazfit Bip smartwatch. The heart rate monitor
was set to sample continuously via the Amazfit Tools application. The data is
exported from the application after the event and analyzed offline using data
analysis tools in Python.

Discussion
==========
A time history of the driver heart rate is shown in the graph below:

![Heart Rate](/assets/images/2018-10-25/heartrate.svg)

The driver experiences a sudden increase in heart rate before the start of the
stint. This increase in heart rate far exceeds the sustained heart rate during
the stint. This is a physiological response in anticipation of getting into the
kart.

In sports psychology, this anticipatory effect is called competitive state
anxiety. One model used to study this effect is the Inverted-U hypothesis. It
suggests that peak performance occurs at an optimal arousal level.

Based on the driver's heightened level of somatic and cognitive anxiety, they
may benefit from cognitive-behavioural strategies to manage their competitive
state before driving. This would allow the driver to begin their stint at an
optimal state of arousal which in turn could lead to better performance
outcomes.

Conclusion
==========
Measuring the driver's physiological response to driving can be as simple
measuring their heart rate. The widespread availability of wearable heart rate
monitors makes this measurement accessible to drivers of all skill levels.

Investigation of driver heart rate during a racing event revealed a
physiological response to a competitive experience. Management of the driver's
arousal level using cognitive-behavioural strategies provides a framework that
can help drivers manage competitive anxiety, and therefore improve performance
outcomes and lap times.

_To learn more about the Lupus Grand Prix and their mission, visit their
website at <http://lupusgp.ca/>_

References
==========
1. Craft, Lynette L., et al. "The relationship between the Competitive State Anxiety Inventory-2 and sport performance: A meta-analysis." Journal of sport and exercise psychology 25.1 (2003): 44-65.
2. Ryska, Todd A. "Cognitive-behavioral strategies and precompetitive anxiety among recreational athletes." The Psychological Record 48.4 (1998): 697-708.
3. Vickers, Joan N., and A. Mark Williams. "Performing under pressure: The effects of physiological arousal, cognitive anxiety, and gaze control in biathlon." Journal of motor behavior 39.5 (2007): 381-394.
4. Watkins, Eric S. "The physiology and pathology of formula one Grand Prix motor racing." Clinical neurosurgery 53.14 (2006): 145-152.

