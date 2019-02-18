---
layout: post
title:  "Super Lap Battle USA 2019 Timing Results"
date:   2019-02-16 16:15:00 -0400
categories: jekyll update
---
Time Attack is a form of motorsport to compete for the best time. With Super
Lap Battle being this weekend, I wanted to know the end-of-day team rankings
and lap times. The timing source does not aggregate lap times from all
sessions. This makes it difficult to follow along with the overall competition.

This is an exercise in data wrangling and data visualization. As a spectator, I
want to see each driver's best lap time so I can better follow the competition.
I used [Pandas](https://pandas.pydata.org/) for data manipulation and
[Bokeh](https://bokeh.pydata.org/) for plotting. Data is extracted from live
timing.

> **NOTE**: 2019/02/16 ~~This post will be updated with day two results when the
> event is over~~

> **NOTE**: 2019/02/17 Added new charts for day two and overall results

{% include 2019/02/16/SLB2019_day1.html %}
{% include 2019/02/16/SLB2019_day2.html %}
{% include 2019/02/16/SLB2019_overall.html %}
