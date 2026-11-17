# Jekyll content baseline

Baseline: `ced0512d171cfd86f5d9eb05033848fd541bdc45`, production build using Jekyll 4.3.4 and mise Ruby 3.3.13. The source workflow uses Ruby 3.1. The machine-readable URL, asset, heading and category inventory is `jekyll-baseline-inventory.json`.

## Conversion-sensitive content

- Liquid includes embed Bokeh fragments in the 2019-02-16, 2020-10-25, 2021-07-12 and 2022-07-12 posts. Other Liquid includes load math or material icons; some posts use `{{ site.url }}` and the 2019-06-01 post uses `post_url`.
- Posts use kramdown attribute lists, `refdef`, `markdown="block"` HTML wrappers, raw HTML, equations, tables, videos, images and footnotes. The 2026 driver-development post includes 18 footnotes. Generated heading IDs are recorded per post in the JSON inventory.
- Interactive content consists of 15 Bokeh fragments across four posts and the ONNX footprint widget in the 2024-08-19 post. The widget's root-relative JavaScript, CSS, WASM and two ONNX models are under `/assets/dist/2024-09-18-continental-ecf-cp-widget/`.

## Browser observations

Native WebKit opened the locally served Jekyll home page and a representative screenshot was captured. On the live 2024 footprint article, all three sliders rendered; changing vertical load from -1000 to -950 updated the input, and the WASM and both ONNX model requests returned HTTP 200. Live Bokeh articles for 2022, 2021, 2020 and 2019 rendered respectively 6, 4, 26 and 3 canvas elements. The 2021 page reported `TypeError: Attempted to assign to readonly property.` in WebKit. Requests to `static.getclicky.com` failed DNS resolution in this environment. These are observed baseline conditions, not proof of all chart interactions.
