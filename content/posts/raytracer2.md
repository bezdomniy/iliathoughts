---
title: "Updated on my Ray Tracer"
date: 2020-09-06T14:08:06+11:00
tags: ["ray tracer", "ray tracer challenge", "webassembly", "emscripten", "C++"]
draft: false
---

My little ray tracer project has had a few improvements since my last post at the start of the year so I thought it would be good to do a new post on the progress.
I have mainly been working on a native version using SDL2 for user input (moving the camera) and presentation. However the web version in my previous post was simply returning a list of RGB values which I would then draw directly to the canvas, and using the left-right buttons for input. Then I discovered that Emscripten has a port of SDL2 so I could use the same approach for the web version as for the native one.

I also wanted the web version to be multithreaded. The simplest way to do this would be to use pthreads, however it seems that not all browsers implement the SharedArrayBuffer object required to make this work. So to make my ray tracer work on all modern web browsers, I used web workers (with no shared memory). How it works is that one worker parses and serialises the scene, then returns a scene binary, which is then distributed to the other web workers for rendering. Each worker renders 1/(number of possible CPU threads) rows of the scene. Keep in mine the first time you render something after loading the page, it will be a slower because the browser needs to create the web workers, and download the data for textures and 3D models.

Since my last post I've implemented texture mapping (see skybox and globe scenes), 3D models and bounding volume heirarchies (see Models scene). After rendering a scene you can click on the canvas, then use your keyobard arrow keys (up,down,left,right) of orbit the scene. I have preloaded a few scenes that you can find in the dropdown list. Also there are the following 3rd models located in /rayTracerModels:

- Stanford Armadillo (armadillo.obj)
- Stanford Dragon (dragon.obj)
- Stanford Bunny (bunny.obj)
- Porsche 911 (porsche.obj)
- Blender's Suzanne (suzanne.obj)

You can use the syntax in the Models (hippy) scene to define a 3D model object and add it to your scene. Keep in mind this has a 3 models with tens of thousands of triangles so it will be slower to render than the other scenes. It takes about 30 seconds on my 4 core laptop. Just change the camera resolution in the YAML to something smaller to render it faster.

So try it out below! I have done some but not a huge amount of error handling so just reload the page if anything breaks. I'll continue to work on this to make it better, but wanted to get it out there for people to try for now.

  <!DOCTYPE HTML>
  <html>
  <body>
  <label>Select number of web workers: </label>
<select id="coreSelect">
</select>
<br>
  <textarea rows=15 cols=50 id="sceneTextArea">
  </textarea>
  <br>
      <select id="scenes" onChange="return setScene()">
          <option scene="0" value="Choose a scene">Choose a scene</option>
          <option scene="1" value="/rayTracerScenes/reflectionScene.yaml">Reflections</option>
          <option scene="1" value="/rayTracerScenes/tables.yaml">Table</option>
          <option scene="2" value="/rayTracerScenes/groups.yaml">Groups</option>
          <option scene="3" value="/rayTracerScenes/cylinders.yaml">Cylinders</option>
          <option scene="4" value="/rayTracerScenes/hippy.yaml">Hippy</option>
          <option scene="5" value="/rayTracerScenes/shadowPuppets.yaml">Shadow Puppets</option>
          <option scene="6" value="/rayTracerScenes/coverScene.yaml">Cover Scene</option>
          <option scene="7" value="/rayTracerScenes/christmas.yaml">Christmas</option>
          <option scene="8" value="/rayTracerScenes/globe.yaml">Globe</option>
          <option scene="9" value="/rayTracerScenes/skybox.yaml">Skybox</option>
          <option scene="9" value="/rayTracerScenes/hippyModels.yaml">Models (Hippy)</option>
      </select>
      <button id="gobutton">go!</button>
      <!-- <button id="testButton">test</button> -->
  <br>
  <button id="leftbutton">left</button>
  <button id="rightbutton">right</button>
  <br>
  <canvas id="canvas" tabindex="1"></canvas>
  <script id="jsscript" src="/js/Runner.js"></script>
  <script>
        //   Module['doNotCaptureKeyboard'] = true;
        // Module['keyboardListeningElement'] = document.getElementById('canvas');
      var textarea = document.getElementById("sceneTextArea");
      var select = document.getElementById("coreSelect"); 
      Module["onRuntimeInitialized"] = function () {
          const logicalProcessors = window.navigator.hardwareConcurrency;
            var options = Array.from(new Array(logicalProcessors), (x, i) => i + 1);
            // console.log(options);
            for(var i = 0; i < options.length; i++) {
                var opt = options[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            // true for mobile device
            select.selectedIndex = parseInt(logicalProcessors/2) - 1;
            }else{
            // false for not mobile device
            select.selectedIndex = parseInt(logicalProcessors) - 1;
            // document.write("not mobile device");
            }
          Module.canvas = (() => document.getElementById('canvas'))();
          var goButton = document.getElementById("gobutton");
          // var testButton = document.getElementById("testButton");
          goButton.addEventListener(
              "click", function() {
              // Module._mainf(textarea.value);
            //   const textCopy = textarea.value;
            console.log(select.options[select.selectedIndex].value);
              Module.ccall('draw', null, ["string","number"], [textarea.value,select.options[select.selectedIndex].value]);
              // Module._test();
          }
          );
          //   testButton.addEventListener(
          //     "click", function() {
          //     Module._killWorker();
          //     }
          // );
          leftbutton.addEventListener(
              "click", function() {
              Module._moveLeft();
              }
          );
          rightbutton.addEventListener(
              "click", function() {
              Module._moveRight();
              }
          );
          document.getElementById('canvas').addEventListener(
              "click", function() {
                  document.getElementById('canvas').focus();
                //   Module.ccall('getModel', null, ["string"], ["/rayTracerModels/donut.obj"]);
              }
          );
      };
      function setScene(){
          // find the dropdown
          var ddl = document.getElementById("scenes");
          // find the selected option
          var selectedOption = ddl.options[ddl.selectedIndex];
          // find the attribute value
          var sceneValue = selectedOption.getAttribute("value");
          // find the textbox
          var textBox = document.getElementById("sceneTextArea");
          fetch(sceneValue)
          .then(response => response.text())
          .then((data) => {
          textBox.value = data
      })
      }
    //   var c = document.getElementById('canvas');
    //   c.addEventListener('keydown',this.check,false);
    //     function check(e) {
    //         alert(e.keyCode);
    //     }
  </script>
  </body>
  </html>
