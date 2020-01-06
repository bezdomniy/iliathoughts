---
title: "Ray Tracer"
date: 2020-01-01T14:08:06+11:00
tags: ["ray tracer", "ray tracer challenge", "webassembly", "emscripten", "C++"]
draft: false
---

My implementation of Chapters 1-12 and 15 of The Ray Tracer Challenge book by Jamis Buck. Implemented in C++ and compiled to WebAssembly. There is a small bug where I get OOM error on very large canvas sizes, but I'll fix this soon.

Just enter the scene description (according to the style used in the book) in the textbox below and click "go!" to generate the render.

Let me know what you think. Code is available on my <a href="https://github.com/bezdomniy/graphics/tree/master/rayTracer">Github</a>. Let me know if you have any tips for me.

<!DOCTYPE HTML>
<html>
<script id="jsscript" src="/js/RayTracer.wasm.js"></script>
<body>
    <br>
<textarea rows=15 cols=50 id="sceneTextArea">
- add: camera
  width: 500
  height: 250
  field-of-view: 1.0472
  from: [0, 1.5, -5]
  to: [0, 1, 0]
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
    # reflective: 0.2
    transparency: 0.8
    refractive-index: 1.52
- define: pink-material
  extend: base-material
  value:
    color: [1, 0.42, 0.7]
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
        - [0.898039215686275, 0.156862745098039, 0.156862745098039]
        - [1, 1, 1]
      transform:
        - [scale, 0.25, 0.25, 0.25]
    diffuse: 0.7
    ambient: 0.1
- define: hippy-material
  value:
    pattern:
      type: blended
      perturbed: 0.1
      patterns:
        - type: stripes
          perturbed: 0.1
          colors:
            - [0.0941176470588235, 0.690196078431373, 0.862745098039216]
            - [0.87843137254902, 0.709803921568627, 0.4]
          transform:
            - [scale, 0.25, 0.25, 0.25]
        - type: stripes
          perturbed: 0.1
          colors:
            - [0.0196078431372549, 0.403921568627451, 0.325490196078431]
            - [0.898039215686275, 0.156862745098039, 0.156862745098039]
          transform:
            - [rotate-y, 1.5708]
            - [scale, 0.25, 0.25, 0.25]
    diffuse: 0.7
    ambient: 0.1
- add: sphere
  material: dalmatian-material
  transform:
    - [rotate-y, 1]
    - [rotate-x, 1]
    - [translate, -0.5, 1, 0.5]
- add: sphere
  material: pink-material
  transform:
    - [scale, 0.5, 0.5, 0.5]
    - [translate, 1.5, 0.5, -0.5]
- add: sphere
  material: blue-material
  transform:
    - [scale, 0.33, 0.33, 0.33]
    - [translate, -1.5, 0.33, -0.75]
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
