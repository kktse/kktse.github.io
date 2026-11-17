---
title: "Measuring the tire vertical stiffness of a 255/40R17 ultra-high performance 200TW tire - Bridgestone Potenza RE-71R"
date: 2021-07-18T08:30:00+00:00
categories: ["tires", "interactive"]
slug: re71r-255-40-r17-tire-vertical-stiffness
---

<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">




![re71r](/assets/images/2021-07-12/bridgestone-re71r-cover-photo.jpg)

<div class="info" style="display:flex; gap:0.5em; background:rgba(127,127,127,0.12); border-radius:0.25em; margin:0 0 1em 0; padding:0.5em 0.75em">
    <span class="material-icons" style="margin-right:0.25em">info</span>
    <div>
    This article was prepared for <i>Formula Delta</i> to demonstrate new tire
    footprint and vertical stiffness testing capabilities. The original version
    of this article can be found <a
    href="https://formuladelta.ca/blog/2021/07/18/measuring-the-tire-vertical-stiffness-of-a-255-40r17-bridgestone-potenza-re-71r/">here</a>.
    </div>
</div>

Managing the relationship between the tire and the vehicle is an important
element of vehicle handling. The tire is the vehicle's interface with the road
and must work with the suspension system to support the vehicle weight.

The tire vertical stiffness is a property that can be helpful in evaluating tire
performance. While it is not an indicator of its grip capabilities, it will
affect the vertical dynamics of the vehicle. To demonstrate the applicability of
this property, we take a popular 200TW ultra-high performance tire and measure
its vertical stiffness. This tire is the Bridgestone Potenza RE-71R 255/40R17
98W.

## Tire load-deflection

The tire is an elastic element that acts in series with the springs to modify
the overall ride rate of the vehicle. Just like an ordinary coil spring, the
tire vertical stiffness can be computed from a load-deflection curve.

Tire load-deflection curves are obtained by exercising the tire through a range
of vertical loads. The tire is compressed into a flat plate where the tire
vertical load and radial deflection are measured. The tangent of the
load-deflection curve at a specific point is the tire vertical stiffness.

$$
K_{Z} = \frac{dF_Z(R_l)}{dR_l} \Bigg|_{F_{Z}=x}
$$

Where:

- $K_Z$ is the tire vertical stiffness [N/mm]
- $F_Z$ is the tire vertical load [N]
- $R_l$ is the tire loaded radius [mm]
- $x$ is the tire vertical load where the vertical stiffness is evaluated [N]

Testing was performed by [_Formula Delta_][1] using their tire vertical
stiffness testing fixture. The tire vertical stiffness testing capabilities of
the [_Formula Delta_][1] tester are shown in the table below.

| Parameter                   | Value   |
| --------------------------- | ------- |
| **Vertical load, max** [N]  | 6675    |
| **Loaded radius, max** [mm] | 375     |
| **Tire width, max** [mm]    | 400     |
| **Inclination angle** [deg] | 0, 2, 4 |
| **Bolt pattern**            | 5x114   |

## Test schedule

![re71r being tested](/assets/images/2021-07-12/bridgestone-re71r-squished-in-testing.jpg)

The tire under test is a used Bridgestone Potenza RE-71R 255/40R17 98W.
Released in North America in 2015, the Bridgestone Potenza RE-71R is a popular
choice for enthusiasts in the ultra-high performance tire segment. This makes it
a good representation of a typical 200TW tire.

Testing is performed in a temperature controlled environment. The test
conditions are summarized in the table below.

| Parameter                      | Conditions         |
| ------------------------------ | ------------------ |
| **Ambient temperature** [degC] | 17                 |
| **Tread depth** [mm]           | 4.5                |
| **Vertical load, max** [N]     | 6230               |
| **Inflation pressure** [PSI]   | 24, 27, 30, 33, 36 |
| **Inclination angle** [deg]    | 0, 2, 4            |

Measurements are taken during both loading and unloading conditions. The data is
fit to a second degree polynomial using least-squares regression. Values are
referenced using the SAE tire coordinate system.

## Analysis

We start the analysis by looking directly at the measured tire load-deflection
curves. The figure below shows the load-deflection curves across all test
conditions and includes a _composite_ curve showing the _average_ response.

<div style="margin-bottom: 1em">
<html lang="en">
<head>
<meta charset="utf-8">
<title>Bokeh Plot</title>
<script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-2.3.3.min.js"
integrity="sha384-dM3QQsP+wXdHg42wTqW85BjZQdLNNIXqlPw/BgKoExPmTG7ZLML4EGqLMfqHT6ON"
crossorigin="anonymous"></script>
<script type="text/javascript">
Bokeh.set_log_level("info");
</script>
</head>
<body>
<div class="bk-root" id="8dc8625c-5eef-4056-b47d-1cb58e5023be" data-root-id="1002"></div>
<script type="application/json" id="1771">
{"2d68d483-83fa-4ab6-98d9-279a2780397d":{"defs":[],"roots":{"references":[{"attributes":{"line_alpha":0.4,"line_color":"rgb(20, 76, 116)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1065","type":"Line"},{"attributes":{"data_source":{"id":"1119"},"glyph":{"id":"1121"},"hover_glyph":{"id":"1123"},"muted_glyph":null,"nonselection_glyph":{"id":"1122"},"view":{"id":"1125"}},"id":"1124","type":"GlyphRenderer"},{"attributes":{"source":{"id":"1119"}},"id":"1125","type":"CDSView"},{"attributes":{},"id":"1171","type":"UnionRenderers"},{"attributes":{"line_color":"rgb(20, 76, 116)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1067","type":"Line"},{"attributes":{"data_source":{"id":"1084"},"glyph":{"id":"1086"},"hover_glyph":{"id":"1088"},"muted_glyph":null,"nonselection_glyph":{"id":"1087"},"view":{"id":"1090"}},"id":"1089","type":"GlyphRenderer"},{"attributes":{},"id":"1160","type":"BasicTickFormatter"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(63, 157, 222)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1038","type":"Line"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(20, 76, 116)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1066","type":"Line"},{"attributes":{"data_source":{"id":"1063"},"glyph":{"id":"1065"},"hover_glyph":{"id":"1067"},"muted_glyph":null,"nonselection_glyph":{"id":"1066"},"view":{"id":"1069"}},"id":"1068","type":"GlyphRenderer"},{"attributes":{"line_color":"rgb(63, 157, 222)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1039","type":"Line"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(63, 157, 222)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1037","type":"Line"},{"attributes":{"data":{"ia":[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],"p":[27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27],"x":{"__ndarray__":"CcMHmHv+c0AH2Hzi5+VzQAbt8SxUzXNABAJnd8C0c0ADF9zBLJxzQAEsUQyZg3NAAEHGVgVrc0D+VTuhcVJzQP1qsOvdOXNA+38lNkohc0D6lJqAtghzQPipD8si8HJA976EFY/XckD10/lf+75yQPTobqpnpnJA8v3j9NONckDxElk/QHVyQO8nzomsXHJA7jxD1BhEckDsUbgehStyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAAPOCMrvhuwABkDxd4hn/AAOnuODEPiMCA2raVBVGQwAAKgvHkvZTAAAPZrzZOmcAAx7vQ+gGewAAqFaqYbKHAAFYSHe3po8CAZlXB+nimwIBc3pbBGanAADetnUHMq8CA9sHVepCuwKBNjp82s7DAgJLebAwnssDgydHSvqOzwKDzZ9FNKbXA4A+haLm3tsCgHn2YAU+4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1190"},"selection_policy":{"id":"1191"}},"id":"1126","type":"ColumnDataSource"},{"attributes":{"data_source":{"id":"1035"},"glyph":{"id":"1037"},"hover_glyph":{"id":"1039"},"muted_glyph":null,"nonselection_glyph":{"id":"1038"},"view":{"id":"1041"}},"id":"1040","type":"GlyphRenderer"},{"attributes":{"source":{"id":"1063"}},"id":"1069","type":"CDSView"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(35, 130, 35)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1128","type":"Line"},{"attributes":{},"id":"1156","type":"Title"},{"attributes":{"source":{"id":"1035"}},"id":"1041","type":"CDSView"},{"attributes":{"line_color":"rgb(75, 205, 75)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1109","type":"Line"},{"attributes":{"line_color":"rgb(35, 130, 35)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1130","type":"Line"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(36, 140, 211)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1044","type":"Line"},{"attributes":{"data":{"ia":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"p":[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],"x":{"__ndarray__":"OfFr60nRc0BFxfDPqrlzQFCZdbQLonNAXG36mGyKc0BnQX99zXJzQHMVBGIuW3NAfumIRo9Dc0CKvQ0r8CtzQJWRkg9RFHNAoWUX9LH8ckCsOZzYEuVyQLgNIb1zzXJAw+GlodS1ckDPtSqGNZ5yQNqJr2qWhnJA5l00T/duckDxMbkzWFdyQP0FPhi5P3JACNrC/BkockAUrkfhehByQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAwD0ABpVz4MNxwAADJUYS6oHAAIEPJWYYi8AA/0TrdTaSwAA8Sq3R85bAAHmXWEbEm8CAWpb26VOgwAD4hDU9z6LAAJUX6RxUpcDAMU4RieKnwIDNKK6BeqrAgGmnvwYcrcCABMpFGMevwMBPSCDbPbHAAJ39V/CcssAA6gTKywC0wMA2XnZtabXAYIMJXdXWtsCgzwZ+A0m4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1172"},"selection_policy":{"id":"1173"}},"id":"1063","type":"ColumnDataSource"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(35, 130, 35)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1129","type":"Line"},{"attributes":{"data_source":{"id":"1126"},"glyph":{"id":"1128"},"hover_glyph":{"id":"1130"},"muted_glyph":null,"nonselection_glyph":{"id":"1129"},"view":{"id":"1132"}},"id":"1131","type":"GlyphRenderer"},{"attributes":{"data":{"ia":[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],"p":[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],"x":{"__ndarray__":"9L9H0jX3c0Cw/1/QG+NzQGs/eM4Bz3NAJ3+QzOe6c0DjvqjKzaZzQJ7+wMizknNAWj7Zxpl+c0AVfvHEf2pzQNG9CcNlVnNAjf0hwUtCc0BIPTq/MS5zQAR9Ur0XGnNAwLxqu/0Fc0B7/IK54/FyQDc8m7fJ3XJA8nuzta/JckCuu8uzlbVyQGr747F7oXJAJTv8r2GNckDhehSuR3lyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAARFa43WBxwACHi1tsjYHAAC8hfviWisAADfahieaRwAAkdlbel5bAgN2QXHpfm8AAHCParh6gwAAayy7EmKLAgGhALP0dpcBACIPSWa6nwMD4kiHaSarAADpwGX7wrMAAzBq6RaKvwGBXyYGYL7HAIPHr+p+TssBgM3VIOf2zwAAeZWpkbLXAALG7YCHhtsBg7HgrcFu4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1174"},"selection_policy":{"id":"1175"}},"id":"1070","type":"ColumnDataSource"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(254, 159, 74)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1072","type":"Line"},{"attributes":{},"id":"1161","type":"AllLabels"},{"attributes":{"line_color":"rgb(36, 140, 211)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1046","type":"Line"},{"attributes":{"source":{"id":"1126"}},"id":"1132","type":"CDSView"},{"attributes":{"line_color":"rgb(254, 159, 74)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1074","type":"Line"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(36, 140, 211)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1045","type":"Line"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(254, 127, 14)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1087","type":"Line"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(254, 159, 74)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1073","type":"Line"},{"attributes":{},"id":"1003","type":"DataRange1d"},{"attributes":{"data_source":{"id":"1042"},"glyph":{"id":"1044"},"hover_glyph":{"id":"1046"},"muted_glyph":null,"nonselection_glyph":{"id":"1045"},"view":{"id":"1048"}},"id":"1047","type":"GlyphRenderer"},{"attributes":{"data_source":{"id":"1070"},"glyph":{"id":"1072"},"hover_glyph":{"id":"1074"},"muted_glyph":null,"nonselection_glyph":{"id":"1073"},"view":{"id":"1076"}},"id":"1075","type":"GlyphRenderer"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(31, 118, 180)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1051","type":"Line"},{"attributes":{"source":{"id":"1042"}},"id":"1048","type":"CDSView"},{"attributes":{"data":{"ia":[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],"p":[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],"x":{"__ndarray__":"YNfG6N32c0DE8TIdp9xzQCgMn1FwwnNAjCYLhjmoc0DwQHe6Ao5zQFRb4+7Lc3NAuHVPI5VZc0AckLtXXj9zQICqJ4wnJXNA5MSTwPAKc0BI3//0ufByQK35aymD1nJAERTYXUy8ckB1LkSSFaJyQNlIsMbeh3JAPWMc+6dtckChfYgvcVNyQAWY9GM6OXJAabJgmAMfckDNzMzMzARyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAAuNrTOAlvwAAemwcwln/AAKKEbF0aiMCA8403D1iQwACvyYUtxpTAgIT1oIlXmcAAcxGJIwyewEC9Dp/9caHAwM0MYIjvo8DA6oIHsn6mwEAUcZV6H6nAwErXCeLRq8DAjbVk6JWuwIDuBdPGtbDAwBzt5mgpssAgURBu2qWzwMCLb2gbK7XA4MwK1iu5tsBAFOK2C1C4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1192"},"selection_policy":{"id":"1193"}},"id":"1133","type":"ColumnDataSource"},{"attributes":{"source":{"id":"1070"}},"id":"1076","type":"CDSView"},{"attributes":{"label":{"value":"Composite"},"renderers":[{"id":"1143"}]},"id":"1145","type":"LegendItem"},{"attributes":{"data":{"ia":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"p":[30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30],"x":{"__ndarray__":"P5aRE2Ldc0BZQv2wushzQHPuaE4TtHNAjJrU62ufc0CmRkCJxIpzQMDyqyYddnNA2p4XxHVhc0D0SoNhzkxzQA337v4mOHNAJ6NanH8jc0BBT8Y52A5zQFv7Mdcw+nJAdKeddInlckCOUwkS4tByQKj/dK86vHJAwqvgTJOnckDcV0zq65JyQPUDuIdEfnJAD7AjJZ1pckApXI/C9VRyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAA7pEXFpVywAAKLZtZsILAADosrmsxjMAAQ2Oi4OaSwAD4fS+twpfAgDpmfhusnMAABo7HldGgwAC2z7DuU6PAwCz4ehjdpcCAagcmE22owMBv/bHeA6vAADzaHnuhrcDg50429CKwwEAVpE2TeLHAIKZs1ZrRssCAmqjNCi60wKDyVzbjjbXAIK56DyTxtsBgzRBZzVe4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1168"},"selection_policy":{"id":"1169"}},"id":"1049","type":"ColumnDataSource"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(27, 100, 27)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1135","type":"Line"},{"attributes":{"data":{"ia":[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],"p":[33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33],"x":{"__ndarray__":"mztWU+rtc0A+PP8sqdhzQOA8qAZow3NAgz1R4Cauc0AmPvq55ZhzQMg+o5Okg3NAaz9MbWNuc0AOQPVGIllzQLBAniDhQ3NAU0FH+p8uc0D2QfDTXhlzQJlCma0dBHNAO0NCh9zuckDeQ+tgm9lyQIFElDpaxHJAI0U9FBmvckDGRebt15lyQGlGj8eWhHJAC0c4oVVvckCuR+F6FFpyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAwD0ASNb9PF5xwABGph82ioHAAGcx4kaRisAAQkZjKOKRwADQW+apkZbAgFxZ+idXm8AAdJ9PURmgwEA5huoMkqLAgP3gzcYVpcCAwa/5fqSnwMCE8m01PqrAAEipKurirMAACtQvnZKvwOBluT6nJrHAQMbCCX+JssCAJgb51fGzwGCGgwysX7XAQOY6RAHTtsCARSyg1Uu4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1176"},"selection_policy":{"id":"1177"}},"id":"1077","type":"ColumnDataSource"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(25, 97, 148)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1058","type":"Line"},{"attributes":{"line_color":"rgb(27, 100, 27)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1137","type":"Line"},{"attributes":{},"id":"1173","type":"UnionRenderers"},{"attributes":{"data_source":{"id":"1077"},"glyph":{"id":"1079"},"hover_glyph":{"id":"1081"},"muted_glyph":null,"nonselection_glyph":{"id":"1080"},"view":{"id":"1083"}},"id":"1082","type":"GlyphRenderer"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(27, 100, 27)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1136","type":"Line"},{"attributes":{"data_source":{"id":"1105"},"glyph":{"id":"1107"},"hover_glyph":{"id":"1109"},"muted_glyph":null,"nonselection_glyph":{"id":"1108"},"view":{"id":"1111"}},"id":"1110","type":"GlyphRenderer"},{"attributes":{"data_source":{"id":"1133"},"glyph":{"id":"1135"},"hover_glyph":{"id":"1137"},"muted_glyph":null,"nonselection_glyph":{"id":"1136"},"view":{"id":"1139"}},"id":"1138","type":"GlyphRenderer"},{"attributes":{"text":"Tire load-deflection curves","text_font_size":"16pt"},"id":"1033","type":"Title"},{"attributes":{"line_color":"rgb(31, 118, 180)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1053","type":"Line"},{"attributes":{"source":{"id":"1077"}},"id":"1083","type":"CDSView"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(254, 143, 44)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1079","type":"Line"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(31, 118, 180)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1052","type":"Line"},{"attributes":{},"id":"1158","type":"AllLabels"},{"attributes":{"source":{"id":"1133"}},"id":"1139","type":"CDSView"},{"attributes":{"data_source":{"id":"1049"},"glyph":{"id":"1051"},"hover_glyph":{"id":"1053"},"muted_glyph":null,"nonselection_glyph":{"id":"1052"},"view":{"id":"1055"}},"id":"1054","type":"GlyphRenderer"},{"attributes":{"line_color":"rgb(254, 127, 14)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1088","type":"Line"},{"attributes":{"label":{"value":"IA: 0 deg"},"renderers":[{"id":"1054"}]},"id":"1146","type":"LegendItem"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(254, 143, 44)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1080","type":"Line"},{"attributes":{"source":{"id":"1140"}},"id":"1144","type":"CDSView"},{"attributes":{"source":{"id":"1049"}},"id":"1055","type":"CDSView"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(254, 127, 14)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1086","type":"Line"},{"attributes":{"data":{"ia":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"p":[27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27],"x":{"__ndarray__":"GpnEC2/Zc0Dp/ZqwMcNzQLhicVX0rHNAiMdH+raWc0BXLB6feYBzQCaR9EM8anNA9fXK6P5Tc0DEWqGNwT1zQJS/dzKEJ3NAYyRO10YRc0AyiSR8CftyQAHu+iDM5HJA0FLRxY7OckCgt6dqUbhyQG8cfg8UonJAPoFUtNaLckAN5ipZmXVyQN1KAf5bX3JArK/Xoh5JckB7FK5H4TJyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAA+BlFx11xwADLTDjxioHAAGs/wSiUisAAbrIeReWRwACPXtYKl5bAABqkh2Vfm8CAhkGZKh+gwAC0fevsmaLAQJaGuvkfpcBALVwGUbGnwIB4/s7yTarAwHdtFN/1rMBAK6nWFamvwMDJ2IrLM7HAIFjDaLGYssCgQBSFPAO0wACDy99sc7XAACDpeELptsBAF21QvWS4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1170"},"selection_policy":{"id":"1171"}},"id":"1056","type":"ColumnDataSource"},{"attributes":{"data_source":{"id":"1140"},"glyph":{"id":"1141"},"hover_glyph":null,"muted_glyph":null,"nonselection_glyph":{"id":"1142"},"view":{"id":"1144"}},"id":"1143","type":"GlyphRenderer"},{"attributes":{},"id":"1005","type":"DataRange1d"},{"attributes":{"data":{"ia":[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],"p":[30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30],"x":{"__ndarray__":"bLsxiGTmc0B055pYKdBzQHwTBCnuuXNAgz9t+bKjc0CLa9bJd41zQJOXP5o8d3NAm8OoagFhc0Cj7xE7xkpzQKobewuLNHNAskfk208ec0C6c02sFAhzQMKftnzZ8XJAyssfTZ7bckDR94gdY8VyQNkj8u0nr3JA4U9bvuyYckDpe8SOsYJyQPCnLV92bHJA+NOWLztWckAAAAAAAEByQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAAzHjOeSZxwABM15M6VoHAALLQBflIisAATZQevLWRwIB/7xzcXpbAgPP5fdwfm8AAprNBvfifwEBNDjS/dKLAAGea+A/5pMDAIH7uUImnwIB6uRWCJarAwHRMbqPNrMDADjf4tIGvwGCkvFnbILHAYJEJUNSGssBgTgJfxfKzwKDbpoauZLXAoDj3xo/ctsDAZfMfaVq4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1178"},"selection_policy":{"id":"1179"}},"id":"1084","type":"ColumnDataSource"},{"attributes":{"data":{"ia":[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],"p":[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],"x":{"__ndarray__":"mE4BIMwOdEBcNDHlpflzQCEaYap/5HNA5f+Qb1nPc0Cp5cA0M7pzQG3L8PkMpXNAMrEgv+aPc0D2llCEwHpzQLp8gEmaZXNAfmKwDnRQc0BDSODTTTtzQAcuEJknJnNAyxNAXgERc0CP+W8j2/tyQFTfn+i05nJAGMXPrY7RckDcqv9yaLxyQKCQLzhCp3JAZXZf/RuSckApXI/C9XxyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAA6CkcattuwAAEcREXb3/AAB4KBRMCiMAApf99OEuQwAADzLZSupTAACnqLFhOmcAAGFrgSAeewADojWiScqHAAKiX//Xzo8AATEo1z4emwIDTpQkeLqnAAECqfOLmq8CAkFeOHLKuwMDiVh/mx7DAQG/Wxvg/ssAAbqo9RsGzwEDe0oPOS7XAAMFPmZHftsAAFiF+j3y4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1184"},"selection_policy":{"id":"1185"}},"id":"1105","type":"ColumnDataSource"},{"attributes":{"line_alpha":0.1,"line_width":4,"x":{"field":"x"},"y":{"field":"y"}},"id":"1142","type":"Line"},{"attributes":{"line_color":"rgb(25, 97, 148)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1060","type":"Line"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(75, 205, 75)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1107","type":"Line"},{"attributes":{"label":{"value":"IA: 2 deg"},"renderers":[{"id":"1089"}]},"id":"1147","type":"LegendItem"},{"attributes":{"source":{"id":"1084"}},"id":"1090","type":"CDSView"},{"attributes":{"bottom_units":"screen","fill_alpha":0.5,"fill_color":"lightgrey","left_units":"screen","level":"overlay","line_alpha":1.0,"line_color":"black","line_dash":[4,4],"line_width":2,"right_units":"screen","syncable":false,"top_units":"screen"},"id":"1025","type":"BoxAnnotation"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(25, 97, 148)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1059","type":"Line"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(75, 205, 75)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1108","type":"Line"},{"attributes":{"data_source":{"id":"1056"},"glyph":{"id":"1058"},"hover_glyph":{"id":"1060"},"muted_glyph":null,"nonselection_glyph":{"id":"1059"},"view":{"id":"1062"}},"id":"1061","type":"GlyphRenderer"},{"attributes":{"label":{"value":"IA: 4 deg"},"renderers":[{"id":"1124"}]},"id":"1148","type":"LegendItem"},{"attributes":{"items":[{"id":"1145"},{"id":"1146"},{"id":"1147"},{"id":"1148"}],"location":"top_left"},"id":"1149","type":"Legend"},{"attributes":{},"id":"1172","type":"Selection"},{"attributes":{"data":{"ia":[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],"p":[27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27],"x":{"__ndarray__":"Nb6/5PHfc0AguglFXMhzQAu2U6XGsHNA9rGdBTGZc0Dhredlm4FzQMupMcYFanNAtqV7JnBSc0ChocWG2jpzQIydD+dEI3NAd5lZR68Lc0BilaOnGfRyQE2R7QeE3HJAOI03aO7EckAjiYHIWK1yQA6FyyjDlXJA+IAViS1+ckDjfF/pl2ZyQM54qUkCT3JAuXTzqWw3ckCkcD0K1x9yQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAAdn4tWTlxwABA6mbGZ4HAAA+BcE1hisCA08HZoMSRwIAE+ZfRb5bAABrm8jgym8AAikR16wWgwID5cL9VfqLAQFv4V1sCpcCAr9o+/JGnwAD2F3Q4LarAAC+w9w/UrMBAWqPJgoavwAC8+HRIIrHAAERNLB2HssAgRc+Kv/GzwIC/fpAvYrXAILNbPW3YtsDAH2aReFS4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1180"},"selection_policy":{"id":"1181"}},"id":"1091","type":"ColumnDataSource"},{"attributes":{"source":{"id":"1056"}},"id":"1062","type":"CDSView"},{"attributes":{"callback":null,"renderers":[{"id":"1040"},{"id":"1047"},{"id":"1054"},{"id":"1061"},{"id":"1068"},{"id":"1075"},{"id":"1082"},{"id":"1089"},{"id":"1096"},{"id":"1103"},{"id":"1110"},{"id":"1117"},{"id":"1124"},{"id":"1131"},{"id":"1138"}],"tooltips":[["IA","@ia [deg]"],["P","@p [PSI]"],["RL","@x{0.f} [mm]"],["FZ","@y{0f} [N]"]]},"id":"1150","type":"HoverTool"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(238, 112, 0)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1093","type":"Line"},{"attributes":{"text":"Bridgestone Potenza RE-71R 255/40R17 98W","text_font_style":"italic"},"id":"1034","type":"Title"},{"attributes":{},"id":"1165","type":"UnionRenderers"},{"attributes":{},"id":"1174","type":"Selection"},{"attributes":{"line_color":"rgb(238, 112, 0)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1095","type":"Line"},{"attributes":{},"id":"1175","type":"UnionRenderers"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(238, 112, 0)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1094","type":"Line"},{"attributes":{},"id":"1176","type":"Selection"},{"attributes":{"data_source":{"id":"1091"},"glyph":{"id":"1093"},"hover_glyph":{"id":"1095"},"muted_glyph":null,"nonselection_glyph":{"id":"1094"},"view":{"id":"1097"}},"id":"1096","type":"GlyphRenderer"},{"attributes":{"line_color":"rgb(254, 143, 44)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1081","type":"Line"},{"attributes":{},"id":"1177","type":"UnionRenderers"},{"attributes":{"above":[{"id":"1033"},{"id":"1034"}],"below":[{"id":"1011"}],"center":[{"id":"1014"},{"id":"1018"},{"id":"1149"}],"left":[{"id":"1015"}],"renderers":[{"id":"1040"},{"id":"1047"},{"id":"1054"},{"id":"1061"},{"id":"1068"},{"id":"1075"},{"id":"1082"},{"id":"1089"},{"id":"1096"},{"id":"1103"},{"id":"1110"},{"id":"1117"},{"id":"1124"},{"id":"1131"},{"id":"1138"},{"id":"1143"}],"sizing_mode":"scale_both","title":{"id":"1156"},"toolbar":{"id":"1026"},"toolbar_location":null,"width":800,"x_range":{"id":"1003"},"x_scale":{"id":"1007"},"y_range":{"id":"1005"},"y_scale":{"id":"1009"}},"id":"1002","subtype":"Figure","type":"Plot"},{"attributes":{"source":{"id":"1091"}},"id":"1097","type":"CDSView"},{"attributes":{},"id":"1178","type":"Selection"},{"attributes":{},"id":"1007","type":"LinearScale"},{"attributes":{},"id":"1179","type":"UnionRenderers"},{"attributes":{},"id":"1168","type":"Selection"},{"attributes":{},"id":"1180","type":"Selection"},{"attributes":{"data":{"ia":[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],"p":[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],"x":{"__ndarray__":"eyQV53Xbc0DaEestMcJzQDr/wHTsqHNAmeyWu6ePc0D42WwCY3ZzQFjHQkkeXXNAt7QYkNlDc0AXou7WlCpzQHaPxB1QEXNA1XyaZAv4ckA1anCrxt5yQJRXRvKBxXJA80QcOT2sckBTMvJ/+JJyQLIfyMazeXJAEg2eDW9gckBx+nNUKkdyQNDnSZvlLXJAMNUf4qAUckCPwvUoXPtxQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAA+EHZxw9xwABbn4FzP4HAABv7vq4misCAH1rSyp6RwIBhZRkUQpbAgFWfNDP9msCA+QckKNCfwMCnz3N5XaLAQKuyv8nepMAAB631BGynwIC7vhUrBarAgMjnHzyqrMDALSgUOFuvwOD1P3kPDLHAIIF3XXhwssCguLq21tqzwGCcCYUqS7XAYCxkyHPBtsCgaMqAsj24wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1182"},"selection_policy":{"id":"1183"}},"id":"1098","type":"ColumnDataSource"},{"attributes":{},"id":"1181","type":"UnionRenderers"},{"attributes":{},"id":"1009","type":"LinearScale"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(208, 97, 0)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1100","type":"Line"},{"attributes":{},"id":"1164","type":"Selection"},{"attributes":{},"id":"1182","type":"Selection"},{"attributes":{"axis_label":"Loaded radius [mm]","formatter":{"id":"1160"},"major_label_policy":{"id":"1158"},"ticker":{"id":"1012"}},"id":"1011","type":"LinearAxis"},{"attributes":{"axis":{"id":"1015"},"dimension":1,"ticker":null},"id":"1018","type":"Grid"},{"attributes":{"line_color":"rgb(208, 97, 0)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1102","type":"Line"},{"attributes":{},"id":"1183","type":"UnionRenderers"},{"attributes":{},"id":"1012","type":"BasicTicker"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(208, 97, 0)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1101","type":"Line"},{"attributes":{},"id":"1184","type":"Selection"},{"attributes":{"axis":{"id":"1011"},"ticker":null},"id":"1014","type":"Grid"},{"attributes":{"data_source":{"id":"1098"},"glyph":{"id":"1100"},"hover_glyph":{"id":"1102"},"muted_glyph":null,"nonselection_glyph":{"id":"1101"},"view":{"id":"1104"}},"id":"1103","type":"GlyphRenderer"},{"attributes":{},"id":"1185","type":"UnionRenderers"},{"attributes":{"data":{"x":{"__ndarray__":"zBjpPDLqc0BoDzMJGtRzQAUGfdUBvnNAofzGoemnc0A98xBu0ZFzQNrpWjq5e3NAduCkBqFlc0AS1+7SiE9zQK/NOJ9wOXNAS8SCa1gjc0Dnusw3QA1zQIOxFgQo93JAIKhg0A/hckC8nqqc98pyQFiV9GjftHJA9Ys+NceeckCRgogBr4hyQC150s2WcnJAym8cmn5cckBmZmZmZkZyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAA2OyfqaNvwADUFAhiFIDAANhM4GaCiMAAo1F4fJmQwAAOjBwME5XAAK3VXOKtmcAAfy45/2mewIBCy1ixo6HAgN8GYwYjpMCAFkq7/rKmwIDnlGGaU6nAgFLnVdkErMCAV0GYu8auwEB7UZSgzLDAgBeGAzU+ssAAgb4ZG7izwEC3+tZSOrXAwLo6O9zEtsAAi35Gt1e4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1194"},"selection_policy":{"id":"1195"}},"id":"1140","type":"ColumnDataSource"},{"attributes":{},"id":"1016","type":"BasicTicker"},{"attributes":{"axis_label":"Vertical load [N]","formatter":{"id":"1163"},"major_label_policy":{"id":"1161"},"ticker":{"id":"1016"}},"id":"1015","type":"LinearAxis"},{"attributes":{},"id":"1169","type":"UnionRenderers"},{"attributes":{},"id":"1186","type":"Selection"},{"attributes":{"source":{"id":"1098"}},"id":"1104","type":"CDSView"},{"attributes":{},"id":"1187","type":"UnionRenderers"},{"attributes":{"data":{"ia":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"p":[33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33],"x":{"__ndarray__":"hWWtAHfjc0CUc8LY589zQKOB17BYvHNAso/siMmoc0DBnQFhOpVzQNGrFjmrgXNA4LkrERxuc0Dvx0DpjFpzQP7VVcH9RnNADeRqmW4zc0Ac8n9x3x9zQCsAlUlQDHNAOg6qIcH4ckBJHL/5MeVyQFgq1NGi0XJAaDjpqRO+ckB3Rv6BhKpyQIZUE1r1lnJAlWIoMmaDckCkcD0K129yQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAApD5O8whywACiZMfdKoLAAO3PYCxzi8CAm7C5sm6SwIA+jH/ENJfAAOH6gcsLnMCAQH7g43mgwECQSJ5c9qLAQF9c+k97pcDArbn0vQiowMB6YI2mnqrAwMdQxAk9rcBAlIqZ5+OvwMDvhgagSbHAIFVtj4mlssAgenhnsAW0wOBeqI4UarXAIAP9BLbStsAgZ3bKlD+4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1166"},"selection_policy":{"id":"1167"}},"id":"1042","type":"ColumnDataSource"},{"attributes":{},"id":"1167","type":"UnionRenderers"},{"attributes":{},"id":"1188","type":"Selection"},{"attributes":{"source":{"id":"1105"}},"id":"1111","type":"CDSView"},{"attributes":{},"id":"1189","type":"UnionRenderers"},{"attributes":{"active_drag":null,"active_multi":null,"active_scroll":null,"active_tap":null,"logo":null,"tools":[{"id":"1019"},{"id":"1020"},{"id":"1021"},{"id":"1022"},{"id":"1023"},{"id":"1024"},{"id":"1150"}]},"id":"1026","type":"Toolbar"},{"attributes":{},"id":"1170","type":"Selection"},{"attributes":{},"id":"1190","type":"Selection"},{"attributes":{"data":{"ia":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"p":[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],"x":{"__ndarray__":"lC1E/Yzsc0A19CnsDdpzQNa6D9uOx3NAd4H1yQ+1c0AYSNu4kKJzQLgOwacRkHNAWdWmlpJ9c0D6m4yFE2tzQJticnSUWHNAPClYYxVGc0Dd7z1SljNzQH62I0EXIXNAH30JMJgOc0DAQ+8eGfxyQGAK1Q2a6XJAAdG6/BrXckCil6Drm8RyQENehtocsnJA5CRsyZ2fckCF61G4Ho1yQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAAnKLvw65ywADyLjx8x4LAAOwYzU5QjMCAnEfV7PiSwADuSGoO1pfAgGqQJYy/nMCACI8Ds9qgwMDweAfOW6PAAO+FHhfjpcBAArZIjnCowIAqCYYzBKvAAGh/1gaercCgXQwdBB+wwOCRatgbcrHAgFBanUrIssAAmttrkCG0wCBu7kPtfbXAwMySJWHdtsAgtsgQ7D+4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1164"},"selection_policy":{"id":"1165"}},"id":"1035","type":"ColumnDataSource"},{"attributes":{"data":{"ia":[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],"p":[33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33],"x":{"__ndarray__":"SErZe6EIdEDVmFs+uPJzQGHn3QDP3HNA7jVgw+XGc0B7hOKF/LBzQAfTZEgTm3NAlCHnCiqFc0AgcGnNQG9zQK2+649XWXNAOg1uUm5Dc0DGW/AUhS1zQFOqctebF3NA4Pj0mbIBc0BsR3dcyetyQPmV+R7g1XJAhuR74fa/ckASM/6jDapyQJ+BgGYklHJAK9ACKTt+ckC4HoXrUWhyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAAAAAAALmd4QtuwABcNRCwqH7AAEYF4h50h8AADC71TOKPwACAyiBxT5TAAA6dY+/UmMAAtA5DoYGdwAC5j1/DKqHAgKHn60+oo8AAFo9GdjmmwAAWhm823qjAAKDMZpCWq8AAtmIshGKuwMArJOAIobDAgME+kZwassBAHYEp/Z2zwMA+66gqK7XAgCV9DyXCtsCA0TZd7GK4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1186"},"selection_policy":{"id":"1187"}},"id":"1112","type":"ColumnDataSource"},{"attributes":{},"id":"1019","type":"PanTool"},{"attributes":{},"id":"1191","type":"UnionRenderers"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(52, 189, 52)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1114","type":"Line"},{"attributes":{},"id":"1020","type":"WheelZoomTool"},{"attributes":{},"id":"1192","type":"Selection"},{"attributes":{"line_color":"rgb(52, 189, 52)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1116","type":"Line"},{"attributes":{"overlay":{"id":"1025"}},"id":"1021","type":"BoxZoomTool"},{"attributes":{},"id":"1193","type":"UnionRenderers"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(52, 189, 52)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1115","type":"Line"},{"attributes":{},"id":"1022","type":"SaveTool"},{"attributes":{},"id":"1194","type":"Selection"},{"attributes":{"data_source":{"id":"1112"},"glyph":{"id":"1114"},"hover_glyph":{"id":"1116"},"muted_glyph":null,"nonselection_glyph":{"id":"1115"},"view":{"id":"1118"}},"id":"1117","type":"GlyphRenderer"},{"attributes":{},"id":"1023","type":"ResetTool"},{"attributes":{},"id":"1195","type":"UnionRenderers"},{"attributes":{"source":{"id":"1112"}},"id":"1118","type":"CDSView"},{"attributes":{},"id":"1024","type":"HelpTool"},{"attributes":{},"id":"1166","type":"Selection"},{"attributes":{"line_width":4,"x":{"field":"x"},"y":{"field":"y"}},"id":"1141","type":"Line"},{"attributes":{"data":{"ia":[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],"p":[30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30],"x":{"__ndarray__":"qh0q05gIdEBd6NtIFPFzQBCzjb6P2XNAw30/NAvCc0B3SPGphqpzQCoTox8Ck3NA3d1UlX17c0CQqAYL+WNzQENzuIB0THNA9j1q9u80c0CqCBxsax1zQF3TzeHmBXNAEJ5/V2LuckDDaDHN3dZyQHYz40JZv3JAKf6UuNSnckDcyEYuUJByQJCT+KPLeHJAQ16qGUdhckD2KFyPwklyQA==","dtype":"float64","order":"little","shape":[20]},"y":{"__ndarray__":"AAAAAAAA0L0AgBxTE+BuwAC0a/WBcH/AACzMcbQAiMAADQWdr0iQwADSt6kgtZTAAGP+Xq1FmcAAw9i8VfqdwIB3o+GMaaHAAHQkufzno8AAV+9kenimwAAhBOUFG6nAgNFiOZ/Pq8CAaAtiRpauwEDzfq99t7DAgCUdGN8sssAAS+BqR6uzwOBjyKe2MrXAAHDVzizDtsBgbwfgqVy4wA==","dtype":"float64","order":"little","shape":[20]}},"selected":{"id":"1188"},"selection_policy":{"id":"1189"}},"id":"1119","type":"ColumnDataSource"},{"attributes":{"line_alpha":0.4,"line_color":"rgb(44, 160, 44)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1121","type":"Line"},{"attributes":{"line_alpha":0.1,"line_color":"rgb(44, 160, 44)","line_width":2.5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1122","type":"Line"},{"attributes":{},"id":"1163","type":"BasicTickFormatter"},{"attributes":{"line_color":"rgb(44, 160, 44)","line_width":5,"x":{"field":"x"},"y":{"field":"y"}},"id":"1123","type":"Line"}],"root_ids":["1002"]},"title":"Bokeh Application","version":"2.3.3"}}
</script>
<script type="text/javascript">
(function () {
var fn = function () {
Bokeh.safely(function () {
(function (root) {
function embed_document(root) {
var docs_json = document.getElementById('1771').textContent;
var render_items = [{ "docid": "2d68d483-83fa-4ab6-98d9-279a2780397d", "root_ids": ["1002"], "roots": { "1002": "8dc8625c-5eef-4056-b47d-1cb58e5023be" } }];
root.Bokeh.embed.embed_items(docs_json, render_items);
}
if (root.Bokeh !== undefined) {
embed_document(root);
} else {
var attempts = 0;
var timer = setInterval(function (root) {
if (root.Bokeh !== undefined) {
clearInterval(timer);
embed_document(root);
} else {
attempts++;
if (attempts > 100) {
clearInterval(timer);
console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
}
}
}, 10, root)
}
})(window);
});
};
if (document.readyState != "loading") fn();
else document.addEventListener("DOMContentLoaded", fn);
})();
</script>
</body>
</html>
</div>

We can already observe the influence of inflation pressure and inclination angle
just by inspecting the load-displacement curves. The change in unloaded radius
due to the inclination angle is primarily an artifact of the SAE tire coordinate
system. However, between inclination angles you can see how the unloaded radius
grows with inflation pressure. With vertical load, there is even more variation
between the conditions.

The tire vertical stiffness can be computed from the load-displacement curves at
a specific vertical load. We have chosen a reference vertical load of 3560 N to
measure the vertical stiffness. The results of the analysis are shown in the
figure below. For reference, the tire vertical stiffness measured from the
_composite_ load-displacement curve is 252.1 N/mm.

<div style="margin-bottom: 1em">
<html lang="en">
<head>
<meta charset="utf-8">
<title>Bokeh Plot</title>
<script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-2.3.3.min.js"
integrity="sha384-dM3QQsP+wXdHg42wTqW85BjZQdLNNIXqlPw/BgKoExPmTG7ZLML4EGqLMfqHT6ON"
crossorigin="anonymous"></script>
<script type="text/javascript">
Bokeh.set_log_level("info");
</script>
</head>
<body>
<div class="bk-root" id="87d294f0-fd61-485b-8d80-e6cf30578836" data-root-id="1772"></div>
<script type="application/json" id="2168">
{"5b577589-11ef-47a8-a9af-183af5bcf2b6":{"defs":[],"roots":{"references":[{"attributes":{"above":[{"id":"1803"},{"id":"1804"}],"below":[{"id":"1781"}],"center":[{"id":"1784"},{"id":"1788"},{"id":"1827"}],"height":500,"left":[{"id":"1785"}],"renderers":[{"id":"1809"},{"id":"1814"},{"id":"1833"},{"id":"1838"},{"id":"1858"},{"id":"1863"}],"sizing_mode":"scale_both","title":{"id":"1816"},"toolbar":{"id":"1796"},"toolbar_location":null,"width":800,"x_range":{"id":"1773"},"x_scale":{"id":"1777"},"y_range":{"id":"1775"},"y_scale":{"id":"1779"}},"id":"1772","subtype":"Figure","type":"Plot"},{"attributes":{},"id":"1794","type":"HelpTool"},{"attributes":{"source":{"id":"1805"}},"id":"1815","type":"CDSView"},{"attributes":{"callback":null,"renderers":[{"id":"1814"},{"id":"1838"},{"id":"1863"}],"tooltips":[["IA","@ia [deg]"],["P","@p [PSI]"],["Kz","@k800{0.f} [N/mm]"]]},"id":"1881","type":"HoverTool"},{"attributes":{},"id":"1820","type":"BasicTickFormatter"},{"attributes":{},"id":"1793","type":"ResetTool"},{"attributes":{},"id":"1878","type":"UnionRenderers"},{"attributes":{"axis_label":"Inflation pressure [PSI]","formatter":{"id":"1820"},"major_label_policy":{"id":"1818"},"ticker":{"id":"1782"}},"id":"1781","type":"LinearAxis"},{"attributes":{},"id":"1818","type":"AllLabels"},{"attributes":{"data":{"ia":[4,4,4,4,4],"k800":{"__ndarray__":"EPAsT80KcUBs8YeLJWBwQEgEaqk5U25A0Lxr5dfibEC4Ogju3fFqQA==","dtype":"float64","order":"little","shape":[5]},"p":[36,33,30,27,24]},"selected":{"id":"1877"},"selection_policy":{"id":"1878"}},"id":"1854","type":"ColumnDataSource"},{"attributes":{"axis":{"id":"1785"},"dimension":1,"ticker":null},"id":"1788","type":"Grid"},{"attributes":{},"id":"1821","type":"AllLabels"},{"attributes":{},"id":"1782","type":"BasicTicker"},{"attributes":{},"id":"1823","type":"BasicTickFormatter"},{"attributes":{"bottom_units":"screen","fill_alpha":0.5,"fill_color":"lightgrey","left_units":"screen","level":"overlay","line_alpha":1.0,"line_color":"black","line_dash":[4,4],"line_width":2,"right_units":"screen","syncable":false,"top_units":"screen"},"id":"1795","type":"BoxAnnotation"},{"attributes":{"axis":{"id":"1781"},"ticker":null},"id":"1784","type":"Grid"},{"attributes":{"line_color":"#2ca02c","line_width":2.5,"x":{"field":"p"},"y":{"field":"k800"}},"id":"1856","type":"Line"},{"attributes":{"data_source":{"id":"1854"},"glyph":{"id":"1856"},"hover_glyph":null,"muted_glyph":null,"nonselection_glyph":{"id":"1857"},"view":{"id":"1859"}},"id":"1858","type":"GlyphRenderer"},{"attributes":{},"id":"1786","type":"BasicTicker"},{"attributes":{},"id":"1824","type":"Selection"},{"attributes":{"axis_label":"Vertical stiffness [N/mm]","formatter":{"id":"1823"},"major_label_policy":{"id":"1821"},"ticker":{"id":"1786"}},"id":"1785","type":"LinearAxis"},{"attributes":{},"id":"1825","type":"UnionRenderers"},{"attributes":{"data_source":{"id":"1805"},"glyph":{"id":"1812"},"hover_glyph":null,"muted_glyph":null,"nonselection_glyph":{"id":"1813"},"view":{"id":"1815"}},"id":"1814","type":"GlyphRenderer"},{"attributes":{"source":{"id":"1805"}},"id":"1810","type":"CDSView"},{"attributes":{"line_alpha":0.1,"line_color":"#1f77b4","line_width":2.5,"x":{"field":"p"},"y":{"field":"k800"}},"id":"1808","type":"Line"},{"attributes":{"line_color":"#1f77b4","line_width":2.5,"x":{"field":"p"},"y":{"field":"k800"}},"id":"1807","type":"Line"},{"attributes":{"line_color":"#ff7f0e","line_width":2.5,"x":{"field":"p"},"y":{"field":"k800"}},"id":"1831","type":"Line"},{"attributes":{"fill_color":{"value":"#ff7f0e"},"line_color":"rgb(244, 114, 0)","size":{"value":10},"x":{"field":"p"},"y":{"field":"k800"}},"id":"1836","type":"Circle"},{"attributes":{"source":{"id":"1854"}},"id":"1859","type":"CDSView"},{"attributes":{"fill_color":{"value":"#2ca02c"},"line_color":"rgb(37, 136, 37)","size":{"value":10},"x":{"field":"p"},"y":{"field":"k800"}},"id":"1861","type":"Circle"},{"attributes":{},"id":"1775","type":"DataRange1d"},{"attributes":{"source":{"id":"1829"}},"id":"1834","type":"CDSView"},{"attributes":{"line_alpha":0.1,"line_color":"#2ca02c","line_width":2.5,"x":{"field":"p"},"y":{"field":"k800"}},"id":"1857","type":"Line"},{"attributes":{"label":{"value":"IA: 2 deg"},"renderers":[{"id":"1838"}]},"id":"1853","type":"LegendItem"},{"attributes":{"data_source":{"id":"1854"},"glyph":{"id":"1861"},"hover_glyph":null,"muted_glyph":null,"nonselection_glyph":{"id":"1862"},"view":{"id":"1864"}},"id":"1863","type":"GlyphRenderer"},{"attributes":{"fill_alpha":{"value":0.1},"fill_color":{"value":"#ff7f0e"},"line_alpha":{"value":0.1},"line_color":"rgb(244, 114, 0)","size":{"value":10},"x":{"field":"p"},"y":{"field":"k800"}},"id":"1837","type":"Circle"},{"attributes":{"items":[{"id":"1828"},{"id":"1853"},{"id":"1880"}],"location":"top_left"},"id":"1827","type":"Legend"},{"attributes":{},"id":"1851","type":"UnionRenderers"},{"attributes":{"data":{"ia":[0,0,0,0,0],"k800":{"__ndarray__":"rNVcuulLckBk5ZiSBFVxQAg3/COaZ3BAEFgPehrvbkDE1CMK6ZBsQA==","dtype":"float64","order":"little","shape":[5]},"p":[36,33,30,27,24]},"selected":{"id":"1824"},"selection_policy":{"id":"1825"}},"id":"1805","type":"ColumnDataSource"},{"attributes":{"source":{"id":"1829"}},"id":"1839","type":"CDSView"},{"attributes":{},"id":"1816","type":"Title"},{"attributes":{"data":{"ia":[2,2,2,2,2],"k800":{"__ndarray__":"/GE+9sRHcUBUl2ZrAj9wQHDAzxr3/G5AYDx3Dw1PbUAgl6C64SZrQA==","dtype":"float64","order":"little","shape":[5]},"p":[36,33,30,27,24]},"selected":{"id":"1850"},"selection_policy":{"id":"1851"}},"id":"1829","type":"ColumnDataSource"},{"attributes":{"data_source":{"id":"1829"},"glyph":{"id":"1836"},"hover_glyph":null,"muted_glyph":null,"nonselection_glyph":{"id":"1837"},"view":{"id":"1839"}},"id":"1838","type":"GlyphRenderer"},{"attributes":{"source":{"id":"1854"}},"id":"1864","type":"CDSView"},{"attributes":{},"id":"1789","type":"PanTool"},{"attributes":{"text":"Bridgestone Potenza RE-71R 255/40R17 98W","text_font_style":"italic"},"id":"1804","type":"Title"},{"attributes":{"text":"Tire vertical stiffness vs. inflation pressure at 3560 N","text_font_size":"16pt"},"id":"1803","type":"Title"},{"attributes":{"fill_alpha":{"value":0.1},"fill_color":{"value":"#1f77b4"},"line_alpha":{"value":0.1},"line_color":"rgb(26, 102, 154)","size":{"value":10},"x":{"field":"p"},"y":{"field":"k800"}},"id":"1813","type":"Circle"},{"attributes":{},"id":"1790","type":"WheelZoomTool"},{"attributes":{"label":{"value":"IA: 4 deg"},"renderers":[{"id":"1863"}]},"id":"1880","type":"LegendItem"},{"attributes":{"data_source":{"id":"1805"},"glyph":{"id":"1807"},"hover_glyph":null,"muted_glyph":null,"nonselection_glyph":{"id":"1808"},"view":{"id":"1810"}},"id":"1809","type":"GlyphRenderer"},{"attributes":{},"id":"1773","type":"DataRange1d"},{"attributes":{"overlay":{"id":"1795"}},"id":"1791","type":"BoxZoomTool"},{"attributes":{},"id":"1877","type":"Selection"},{"attributes":{},"id":"1779","type":"LinearScale"},{"attributes":{"active_drag":null,"active_multi":null,"active_scroll":null,"active_tap":null,"logo":null,"tools":[{"id":"1789"},{"id":"1790"},{"id":"1791"},{"id":"1792"},{"id":"1793"},{"id":"1794"},{"id":"1881"}]},"id":"1796","type":"Toolbar"},{"attributes":{"data_source":{"id":"1829"},"glyph":{"id":"1831"},"hover_glyph":null,"muted_glyph":null,"nonselection_glyph":{"id":"1832"},"view":{"id":"1834"}},"id":"1833","type":"GlyphRenderer"},{"attributes":{},"id":"1792","type":"SaveTool"},{"attributes":{"label":{"value":"IA: 0 deg"},"renderers":[{"id":"1814"}]},"id":"1828","type":"LegendItem"},{"attributes":{},"id":"1850","type":"Selection"},{"attributes":{"line_alpha":0.1,"line_color":"#ff7f0e","line_width":2.5,"x":{"field":"p"},"y":{"field":"k800"}},"id":"1832","type":"Line"},{"attributes":{"fill_alpha":{"value":0.1},"fill_color":{"value":"#2ca02c"},"line_alpha":{"value":0.1},"line_color":"rgb(37, 136, 37)","size":{"value":10},"x":{"field":"p"},"y":{"field":"k800"}},"id":"1862","type":"Circle"},{"attributes":{},"id":"1777","type":"LinearScale"},{"attributes":{"fill_color":{"value":"#1f77b4"},"line_color":"rgb(26, 102, 154)","size":{"value":10},"x":{"field":"p"},"y":{"field":"k800"}},"id":"1812","type":"Circle"}],"root_ids":["1772"]},"title":"Bokeh Application","version":"2.3.3"}}
</script>
<script type="text/javascript">
(function () {
var fn = function () {
Bokeh.safely(function () {
(function (root) {
function embed_document(root) {
var docs_json = document.getElementById('2168').textContent;
var render_items = [{ "docid": "5b577589-11ef-47a8-a9af-183af5bcf2b6", "root_ids": ["1772"], "roots": { "1772": "87d294f0-fd61-485b-8d80-e6cf30578836" } }];
root.Bokeh.embed.embed_items(docs_json, render_items);
}
if (root.Bokeh !== undefined) {
embed_document(root);
} else {
var attempts = 0;
var timer = setInterval(function (root) {
if (root.Bokeh !== undefined) {
clearInterval(timer);
embed_document(root);
} else {
attempts++;
if (attempts > 100) {
clearInterval(timer);
console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
}
}
}, 10, root)
}
})(window);
});
};
if (document.readyState != "loading") fn();
else document.addEventListener("DOMContentLoaded", fn);
})();
</script>
</body>
</html>
</div>

The influence of inflation pressure and inclination angle on vertical stiffness
is more apparent in this analysis. As the inflation pressure increases, the tire
vertical stiffness increases. This relationship is observed across all
inclination angles. Increasing the inclination angle from 0 deg to 2 deg
decreases the vertical stiffness by 5.5% on average. However, increasing the
inclination angle from 2 deg to 4 deg does not have the same effect. On average,
the vertical stiffness is reduced by 1%, with only the 33 PSI condition showing
an increase in vertical stiffness.

## Final comments

In this study, we measured the vertical stiffness of the Bridgestone Potenza
RE-71R 255/40R17 98W tire under different inflation pressure and inclination
angle conditions. We found that the vertical stiffness at 3560 N can vary from
215.6 N/mm to 292.7 N/mm depending on the conditions. The influence of inflation
pressure on vertical stiffness is observed at all inclination angles. It is less
clear how inclination angle affects the tire vertical stiffness. At reference
load, there is an overall reduction of ~5.5% in tire vertical stiffness when the
inclination angle goes from 0 deg to 2 deg. However, increasing the inclination
angle from 2 deg to 4 deg did not have the same effect.

The tire is an elastic springing element in the suspension system that cannot be
ignored. Understanding the relationship between the tires and the chassis
affords you better tuning control over the ride and the lateral load transfer
distribution. With manufacturers being opaque with the technical data of their
products, laboratory tire tests represent one way to gain insight into tire
performance. The vertical stiffness test can be repeated with several tires to
provide insight into how tire manufacturers are differentiating their products,
especially in today's competitive enthusiast tire market.

## Acknowledgements

This analysis is possible thanks to **Ping Zhang** at [_Formula Delta_][1].
This analysis required considerable amount of design, manufacturing and testing
support. You can learn more about [_Formula Delta_][1] on [Facebook][2] and
[Instagram][3]!

## References

1. Gent, A. N., & Walter, J. D. (2006). Pneumatic tire.
1. Milliken, William F., and Douglas L. Milliken. _Race car vehicle dynamics_. Vol. 400. Warrendale: Society of Automotive Engineers, 1995.

[1]: https://formuladelta.ca/
[2]: https://www.facebook.com/FormulaDeltaConsult
[3]: https://www.instagram.com/formula.delta/
