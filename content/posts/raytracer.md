---
title: "Ray Tracer"
date: 2020-01-01T14:08:06+11:00
tags: ["ray tracer", "ray tracer challenge", "webassembly", "emscripten", "C++"]
draft: false
---

My implementation of Chapters 1-15 of The Ray Tracer Challenge book by Jamis Buck. Implemented in C++ and compiled to WebAssembly.

Just select a scene description from the dropdown (or enter your own according to the style used in the book) and click "go!" to generate the render.

Let me know what you think. Code is available on my <a href="https://github.com/bezdomniy/graphics/tree/master/rayTracer">Github</a>. Let me know if you have any tips for me.

EDIT: If it doesn't run, please clear your cache. I messed up the http headers the first time I pushed this and the wasm module cache never expires... so if you ran the site previously it won't update.

<!DOCTYPE HTML>
<html>
<script id="jsscript" src="/js/RayTracer.wasm.js"></script>
<body>
<textarea rows=15 cols=50 id="sceneTextArea">
</textarea>
<br>
<!-- <input id="myFile" type="text"/> -->
    <select id="scenes" onChange="return setScene()">
        <option scene="0" value="Choose a scene">Choose a scene</option>
        <option scene="1" value="/rayTracerScenes/reflectionScene.yaml">Reflections</option>
        <option scene="2" value="/rayTracerScenes/groups.yaml">Groups</option>
        <option scene="3" value="/rayTracerScenes/cylinders.yaml">Cylinders</option>
        <option scene="4" value="/rayTracerScenes/hippy.yaml">Hippy</option>
        <option scene="5" value="/rayTracerScenes/shadowPuppets.yaml">Shadow Puppets</option>
        <option scene="6" value="/rayTracerScenes/coverScene.yaml">Cover Scene</option>
        <option scene="7" value="/rayTracerScenes/christmas.yaml">Christmas</option>
    </select>
    <button id="gobutton">go!</button>
<br>
<button id="leftbutton">left</button>
<button id="rightbutton">right</button>
<br>
<canvas id="outCanvas"></canvas>
<script>
// import \* as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';
var goButton = document.getElementById("gobutton");
var leftButton = document.getElementById("leftbutton");
var rightButton = document.getElementById("rightbutton");
var textarea = document.getElementById("sceneTextArea");
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
imageData.data[i + 0] = bytes[i + 0]; // R value
imageData.data[i + 1] = bytes[i + 1]; // G value
imageData.data[i + 2] = bytes[i + 2]; // B value
imageData.data[i + 3] = 255; // A value
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
</script>

</body>

</html>
