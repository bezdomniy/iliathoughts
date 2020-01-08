---
title: "Ray Tracer"
date: 2020-01-01T14:08:06+11:00
tags: ["ray tracer", "ray tracer challenge", "webassembly", "emscripten", "C++"]
draft: false
---

My implementation of Chapters 1-12 and 15 of The Ray Tracer Challenge book by Jamis Buck. Implemented in C++ and compiled to WebAssembly. There is a small bug where I get OOM error on very large canvas sizes, but I'll fix this soon.

Just enter the scene description (according to the style used in the book) in the textbox below and click "go!" to generate the render.

Let me know what you think. Code is available on my <a href="https://github.com/bezdomniy/graphics/tree/master/rayTracer">Github</a>. Let me know if you have any tips for me.

EDIT: If it doesn't run, please clear your cache. I messed up the http headers the first time I pushed this and the wasm module cache never expires... so if you ran the site previously it won't update.

<!DOCTYPE HTML>
<html>
<script id="jsscript" src="/js/RayTracer.wasm.js"></script>
<body>
    <br>
<textarea rows=15 cols=50 id="sceneTextArea">
- add: camera
  width: 600
  height: 300
  field-of-view: 1.0472
  from: [-.2, 2, -5]
  to: [0, 0.8, 0]
  up: [0, 1, 0]
- add: light
  at: [-5, 10, -5]
  intensity: [1, 1, 1]
- define: base-material
  value:
    color: [1, 1, 1]
    diffuse: 0.7
    ambient: 0.1
    specular: 0.3
    shininess: 200
- define: blue-material
  extend: base-material
  value:
    color: [0.537, 0.831, 0.914]
    transparency: 0.5
    refractive-index: 1.655
- define: pink-material
  extend: base-material
  value:
    color: [1, 0.42, 0.7]
    reflective: 0.2
- define: standard-transform
  value:
    - [scale, 0.5, 0.5, 0.5]
    - [translate, 1, -1, 1]
- define: dalmatian-material
  value:
    pattern:
      type: checkers
      perturbed: 0.5
      colors:
        - [0.90, 0.16, 0.16]
        - [1, 1, 1]
      transform:
        - [scale, 0.25, 0.25, 0.25]
    diffuse: 0.7
    ambient: 0.1
    transparency: 0.8
    refractive-index: 1.52
- define: hippy-material
  value:
    pattern:
      type: blended
      perturbed: 0.1
      patterns:
        - type: stripes
          perturbed: 0.1
          colors:
            - [0.09, 0.69, 0.86]
            - [0.88, 0.71, 0.4]
          transform:
            - [scale, 0.25, 0.25, 0.25]
        - type: stripes
          perturbed: 0.1
          colors:
            - [0.02, 0.40, 0.33]
            - [0.9, 0.16, 0.16]
          transform:
            - [rotate-y, 1.5708]
            - [scale, 0.25, 0.25, 0.25]
    diffuse: 0.7
    ambient: 0.1
- add: cylinder
  args: [-1, 1, 1]
  material: pink-material
  transform:
    - [scale, 0.75, 0.75, 0.75]
    - [rotate-y, -0.5]
    - [translate, -0.2, 0.75, 0.5]
- add: cube
  material: dalmatian-material
  transform:
    - [scale, 0.5, 0.5, 0.5]
    - [translate, 1.5, 0.5, -0.5]
- add: sphere
  material: blue-material
  transform:
    - [scale, 0.5, 0.5, 0.5]
    - [translate, -1.5, 0.5, -1]
- add: plane
  material: hippy-material
  transform:
    - [rotate-x, 1.5708]
    - [translate, 0, 0, 2.5]
- add: plane
  material: hippy-material
</textarea>
<button id="gobutton">go!</button>
<br>
<img id="outImage" />
	<script type="module">
	    import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';
        var button = document.getElementById("gobutton");
        var textarea = document.getElementById("sceneTextArea");
        button.addEventListener(
            "click", function() {
            Module.runRayTracer(textarea.value);
        let DoMagickCall = async function()
        {
        const outputImage = document.getElementById("outImage");
        const sourceBytes =  await Module.FS.readFile('out.ppm');
        let processedFiles = await Magick.Call([ {'name' : 'out.ppm', 'content' : sourceBytes} ], [ "convert", "out.ppm", "out.png" ]);
        const firstOutputImage = processedFiles[0];
        outputImage.src = URL.createObjectURL(firstOutputImage["blob"]);
        };
        DoMagickCall();
        });
	</script>
	</body>
</html>
