---
title: "Ray Tracer"
date: 2020-01-01T14:08:06+11:00
tags: ["ray tracer", "ray tracer challenge", "webassembly", "emscripten"]
draft: true
---

My implementation of most of the Ray Tracer Challenge book by Jamis Buck. Implemented in C++11 and compiled to WebAssembly.

<!DOCTYPE HTML>
<html>
<script id="jsscript" src="/js/RayTracer.wasm.js"></script>
<body>
    <br>
	<textarea rows=15 cols=50 id="sceneTextArea">- add: camera
  width: 500
  height: 250
  field-of-view: 1.0472
  from: [0, 1.5, -5]
  to: [0, 1, 0]
  up: [0, 1, 0]
- add: light
  at: [-10, 10, 0]
  intensity: [1, 1, 1]
- define: base-material
  value:
    color: [1, 1, 1]
    diffuse: 0.7
    ambient: 0.1
    specular: 0.3
    shininess: 200
    reflective: 0.1
- define: blue-material
  extend: base-material
  value:
    color: [0.537, 0.831, 0.914]
- define: white-material
  extend: base-material
  value:
    color: [1, 1, 1]
- define: standard-transform
  value:
    - [scale, 0.5, 0.5, 0.5]
    - [translate, 1, -1, 1]
- add: sphere
  material: blue-material
  transform:
    - [rotate-y, 1]
    - [rotate-x, 1]
    - [translate, -0.5, 1, 0.5]
- add: sphere
  material: blue-material
  transform:
    - [scale, 0.5, 0.5, 0.5]
    - [translate, 1.5, 0.5, -0.5]
- add: sphere
  material: blue-material
  transform:
    - [scale, 0.33, 0.33, 0.33]
    - [translate, -1.5, 0.33, -0.75]
- add: plane
  material:
    pattern:
      type: checkers
      colors:
        - [0, 0, 0]
        - [1, 1, 1]
      transform:
        - [scale, 0.25, 0.25, 0.25]
    diffuse: 0.7
    ambient: 0.1
- add: plane
  material: 
    pattern:
      type: checkers
      colors:
        - [0, 0, 0]
        - [1, 1, 1]
      transform:
        - [scale, 0.25, 0.25, 0.25]
    diffuse: 0.7
    ambient: 0.1
  transform:
    - [rotate-x, 1.5708]
    - [translate, 0, 0, 2.5]
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
