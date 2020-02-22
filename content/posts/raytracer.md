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
  height: 200
  field-of-view: 0.9
  from: [0, 0, -9]
  to: [0, 0, 0]
  up: [0, 1, 0]
- add: light
  at: [ 10000, 10000, -10000 ]
  intensity: [ 0.25, 0.25, 0.25 ]
- add: light
  at: [ -10000, 10000, -10000 ]
  intensity: [ 0.25, 0.25, 0.25 ]
- add: light
  at: [ 10000, -10000, -10000 ]
  intensity: [ 0.25, 0.25, 0.25 ]
- add: light
  at: [ -10000, -10000, -10000 ]
  intensity: [ 0.25, 0.25, 0.25 ]
- define: leg
  value:
    add: group
    children:
      - add: sphere
        transform:
          - [ scale, 0.25, 0.25, 0.25 ]
          - [ translate, 0, 0, -1 ]
      - add: cylinder
        args: [0, 1, 0]
        transform:
          - [ scale, 0.25, 1, 0.25 ]
          - [ rotate-z, -1.5708 ]
          - [ rotate-y, -0.5236 ]
          - [ translate, 0, 0, -1 ]
- define: cap
  value:
    add: group
    children:
      - add: cone
        args: [-1, 0, 0]
        transform:
          - [ scale, 0.24606, 1.37002, 0.24606 ]
          - [ rotate-x, -0.7854 ]
      - add: cone
        args: [-1, 0, 0]
        transform:
          - [ scale, 0.24606, 1.37002, 0.24606 ]
          - [ rotate-x, -0.7854 ]
          - [ rotate-y, 1.0472 ]
      - add: cone
        args: [-1, 0, 0]
        transform:
          - [ scale, 0.24606, 1.37002, 0.24606 ]
          - [ rotate-x, -0.7854 ]
          - [ rotate-y, 2.0944 ]
      - add: cone
        args: [-1, 0, 0]
        transform:
          - [ scale, 0.24606, 1.37002, 0.24606 ]
          - [ rotate-x, -0.7854 ]
          - [ rotate-y, 3.1416 ]
      - add: cone
        args: [-1, 0, 0]
        transform:
          - [ scale, 0.24606, 1.37002, 0.24606 ]
          - [ rotate-x, -0.7854 ]
          - [ rotate-y, 4.1888 ]
      - add: cone
        args: [-1, 0, 0]
        transform:
          - [ scale, 0.24606, 1.37002, 0.24606 ]
          - [ rotate-x, -0.7854 ]
          - [ rotate-y, 5.236 ]
- define: wacky
  value:
    add: group
    children:
      - add: leg
      - add: leg
        transform:
          - [ rotate-y, 1.0472 ]
      - add: leg
        transform:
          - [ rotate-y, 2.0944 ]
      - add: leg
        transform:
          - [ rotate-y, 3.1416 ]
      - add: leg
        transform:
          - [ rotate-y, 4.1888 ]
      - add: leg
        transform:
          - [ rotate-y, 5.236 ]
      - add: cap
        transform:
          - [ translate, 0, 1, 0 ]
      - add: cap
        transform:
          - [ translate, 0, 1, 0 ]
          - [ rotate-x, 3.1416 ]
- add: plane
  transform:
    - [ rotate-x, 1.5708 ]
    - [ translate, 0, 0, 100 ]
  material:
    color: [ 1, 1, 1 ]
    ambient: 1
    diffuse: 0
    specular: 0
- add: wacky
  transform:
    - [ rotate-y, 0.1745 ]
    - [ rotate-x, 0.4363 ]
    - [ translate, -2.8, 0, 0 ]
  material:
    color: [ 0.9, 0.2, 0.4 ]
    ambient: 0.2
    diffuse: 0.8
    specular: 0.7
    shininess: 20
- add: wacky
  transform:
    - [ rotate-y, 0.1745 ]
  material:
    color: [ 0.2, 0.9, 0.6 ]
    ambient: 0.2
    diffuse: 0.8
    specular: 0.7
    shininess: 20
- add: wacky
  transform:
    - [ rotate-y, -0.1745 ]
    - [ rotate-x, -0.4363 ]
    - [ translate, 2.8, 0, 0 ]
  material:
    color: [ 0.2, 0.3, 1.0 ]
    ambient: 0.2
    diffuse: 0.8
    specular: 0.7
    shininess: 20
</textarea>
<button id="gobutton">go!</button>
<br>
<button id="leftbutton">left</button>
<button id="rightbutton">right</button>
<br>
<!-- <img id="outImage" /> -->
<canvas id="outCanvas"></canvas>
	<script>
	    // import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';
        var goButton = document.getElementById("gobutton");
        var leftButton = document.getElementById("leftbutton");
        var rightButton = document.getElementById("rightbutton");
        var textarea = document.getElementById("sceneTextArea");
        // Module.onRuntimeInitialized = _ => {
        Module['onRuntimeInitialized'] = function() {
          console.log("loaded");
          const runner = new Module.EmscriptenRunner();
          function updateRender() {            
            if (!runner.done()) {
              var i;
              var bytes = runner.renderToRGBA();
              const canvas = document.getElementById('outCanvas');
              const ctx = canvas.getContext('2d');
              ctx.canvas.width = runner.getWidth();
              ctx.canvas.height = runner.getHeight();
              const imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
              // Iterate through every pixel
              for (let i = 0; i < imageData.data.length; i += 4) {
                // Modify pixel data
                imageData.data[i + 0] = bytes[i + 0];  // R value
                imageData.data[i + 1] = bytes[i + 1];    // G value
                imageData.data[i + 2] = bytes[i + 2];  // B value
                imageData.data[i + 3] = 255;  // A value
              }
              // Draw image data to the canvas
              ctx.putImageData(imageData, 0, 0);
            } 
          }
        // const runner = new Module.EmscriptenRunner(textarea.value);
        var t;
        var updateTime= 33;
        var repeatLeft = function (action) {
                  runner.moveLeft();
                  t = setTimeout(repeatLeft, updateTime);
              }
        var repeatRight = function (action) {
                  runner.moveRight();
                  t = setTimeout(repeatRight, updateTime);
              }      
        goButton.addEventListener(
            "click", function() {
              runner.init(textarea.value);
              let showImg = setInterval(updateRender, updateTime);
            }
            );
        leftButton.addEventListener(
            "mousedown", function() {
              repeatLeft();
            }
            );
        rightButton.addEventListener(
            "mousedown", function() {
              repeatRight();
            }
            );
        leftButton.addEventListener(
            "mouseup", function() {
              clearTimeout(t);
            }
            );
        rightButton.addEventListener(
            "mouseup", function() {
              clearTimeout(t);
            }
            );
          };
    </script>
    </body>

</html>
