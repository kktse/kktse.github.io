---
layout: post
title:  "Analyzing the Live Timing - Champcar Road Atlanta Edition"
date:   2018-02-08 15:15:00 -0400
categories: jekyll update
---
It is difficult not to be impressed by the live coverage put out by the
ChampCar team considering it is an amateur racing series. So when I tuned into
this year's race at Road Atlanta, I was pleasantly surprised to find [live
timing](https://speedhive.mylaps.com/Sessions/4726548), [a live
stream](https://www.youtube.com/watch?v=dQDZv4hWIGQ), [on-board
footage](https://www.youtube.com/watch?v=-roEm_l-D5E]), and even [pit lane
commentary](https://www.youtube.com/watch?v=G90hBmHCG8Q)!

Particularly interest was the live timing stream which pulled the most
up-to-date race data as a JSON file. By extracting the underlying data and
running it through custom plotting routines, it becomes possible to perform
advanced
[lap](http://p1software.com/p1analysis/2018-weathertech-daytona-analysis/)
[time](http://www.travisbaraki.com/analysis/a-closer-look-at-the-24-hours-of-daytona/)
[analysis](http://theansweris27.com/race-charts-analysis-for-the-24-hours-of-le-mans-2015/)
more commonly seen in higher levels of motorsport.

Lets see what we can learn from the extracting this data from ChumpCar's 2018
14-Hours of Road Atlanta.

## Overall
First, we explore the race as a whole to see the overall level of performance
between the teams. This lets us get a feel of how competitive the race is.

# Best and Average Lap Times
Each team's best and average lap times are plotted in a bar chart in order of
place finishing. In this plot, 'average' refers to the overall average of the
event. In other words, the average is the total runtime of the event divided by
the number of laps.

![Race Position]({{ site.url }}/assets/images/2018-02-08/median_average_lap_time_everyone.svg)

Best lap time does not appear to be an indicator of placing or or best lap
time. It is an early reminder how important consistency, not raw performance,
can be in endurance racing.

# Box Plot
The box plot is another way of understanding how each team performed relative
to each other, this time emphasizing the distribution of lap times rather than
the best and average times.

![Race Position]({{ site.url }}/assets/images/2018-02-08/box_plot_everyone.svg)

The top third of the pack has good overall pace with good median times and
tight control of their lap times. Further down the pack we see more of
variations between the teams. Some teams have good pace but are likely losing
time in the pits. Some teams lack the pace and/or the driver who can
consistently drive the car to its full potential.

# Rising Lap Time
The rising lap time shows each team's lap time in ascending order. Although we
cannot pick out any individual team in this particular graph, it is still
interesting to see the consequence of each team's unique situation.

![Race Position]({{ site.url }}/assets/images/2018-02-08/rising_time_vs_lap_everyone.svg)

Best lap times are contained within a ~10 second band, showing how close the
teams are in terms of raw lap time performance. Larger differences are seen as
lap times rise, highlighting when cars begin to break down and enter the pits.

## Top Five Teams
We can observe specific differences between teams by focusing our attention to
a subset of teams. We will start by following the top five finishers of the
race. These teams are:

* Car #146 -  Huggins (Pinkies Out)
* Car #213 -  23 Van Winden Racing
* Car #935 -  Team Jacky Ickx 935
* Car #187 -  Team Punisher
* Car #19 -  Team Infinite

# Race Position
This plot shows the progression of a team's race position over time. It shares
the story of how the teams got to their finishing position relative to how they
started.

![Race Position]({{ site.url }}/assets/images/2018-02-08/race_position_vs_time.svg)

It is possible to recover from a poor start and still place within the top
five. Team Jacky Ickx 935 made a fine recovery from the back of the grid and
finishing in third place.

# Rising Lap Time
The rising lap time is a way to describe the distribution of lap times over the
course of the race. Comparing where the lines intersect relative to one another
highlight the relative strengths and weaknesses of each team.

![Rising Lap Time]({{ site.url }}/assets/images/2018-02-08/rising_time_vs_lap.svg)

Huggins (Pinkies Out) has the fastest car and outperformed the competition in
terms of pit stop time. 23 Van Winden Racing and Team Jacky Ickx 935 have great
consistency, but ultimately did not manage their slower laps and pit stops as
well as Huggins (Pinkies Out).

# Lap Time Box Plot
Like the previous plot, the box plot describes the distribution of lap times
but as a more conventional visualization.

![Lap Time Box Plot]({{ site.url }}/assets/images/2018-02-08/laptime_boxplot.svg)

The top four teams have similar median lap times, but differ in their
distribution. Team Punisher has similar raw lap time performance to race winner
Huggins (Pinkies Out), but ultimately lacked the consistency to maintain the
pace.

# Accumulating Outing Average
The accumulating outing average is the average of all the laps up the current
lap. It helps show the outing progresses over time without highlighting
lap-to-lap variation.

![Accumulating Outing Average]({{ site.url }}/assets/images/2018-02-08/outing_growing_average.svg)

We already discussed the lap time performance of each of these teams, so there
is no new information in that regard. Of greater interest is the profile of
each curve. We can see different outing profiles within the teams, suggesting a
driver change and a different driving style.

## Top Two Teams
We can focus our analysis to the individual team level to gain further insights
into their unique performance characteristics. We narrow our scope to the top
two race finishers:

* Car #146 -  Huggins (Pinkies Out)
* Car #213 -  23 Van Winden Racing

# Box Plot
We have used the box plot before to visualize the distribution of the lap
times, but this time we can observe the distribution for every outing.

![Box Plot 1]({{ site.url }}/assets/images/2018-02-08/laptime_boxplot_Huggins (Pinkies Out).svg)
![Box Plot 2]({{ site.url }}/assets/images/2018-02-08/laptime_boxplot_23 Van Winden racing.svg)

The difference in strategy and consistency is clear. 23 Van Winden Racing is
more consistent between outings while Huggins (Pinkies Out) strived for raw lap
time in some outings. Interestingly, 23 Van Winden Racing has a lower median
lap time than Huggins (Pinkies Out). Although 23 Van Winden had the pace to be
race winner, the race was ultimately won by managing the slower laps and pit
stops.

# Pit Times
Pit-in laps are identified based on knowledge of the minimum pit time
requirement. We can compare the pit-stop performance by observing the lap time
containing a stop.

![Pit Times 1]({{ site.url }}/assets/images/2018-02-08/pitstop_duration_Huggins (Pinkies Out).svg)
![Pit Times 2]({{ site.url }}/assets/images/2018-02-08/pitstop_duration_23 Van Winden racing.svg)

Huggins (Pinkies Out) has an advantage with one less pit stop than 23 Van
Winden Racing. Huggins (Pinkies Out) show excellent consistency between pit
stops, exemplifying their reliability and skilled pit crew. That is not to
discount 23 Van Winden Racing's excellent showing at this race, though the
extra pit stop and extra time in session #5 did not help them get closer to
winning the event.

## Conclusion
Advanced lap time analysis need not be reserved only for highest levels of
motorsports. Even at the amateur level, useful insights about the competition
can be drawn from the data. Congratulations to Car #146 Huggins (Pinkies Out)
for a well deserved race victory!
