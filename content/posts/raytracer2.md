---
title: "Ray Tracer"
date: 2020-01-01T14:08:06+11:00
tags: ["ray tracer", "ray tracer challenge", "webassembly", "emscripten", "C++"]
draft: false
---

<!DOCTYPE HTML>
<html>
<script id="jsscript" src="/js/RayTracer.wasm.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.14.0/js-yaml.js"></script>
<body>
<textarea rows=15 cols=50 id="sceneTextArea">
</textarea>
<br>
    <select id="scenes" onChange="return setScene()">
        <option scene="0" value="Choose a scene">Choose a scene</option>
        <option scene="1" value="/rayTracerScenes/reflectionScene.yaml">Reflections</option>
        <option scene="2" value="/rayTracerScenes/groups.yaml">Groups</option>
        <option scene="3" value="/rayTracerScenes/cylinders.yaml">Cylinders</option>
        <option scene="4" value="/rayTracerScenes/hippy.yaml">Hippy</option>
        <option scene="5" value="/rayTracerScenes/shadowPuppets.yaml">Shadow Puppets</option>
        <option scene="6" value="/rayTracerScenes/coverScene.yaml">Cover Scene</option>
        <option scene="7" value="/rayTracerScenes/christmas.yaml">Christmas</option>
        <option scene="8" value="/rayTracerScenes/globe.yaml">Globe</option>
        <option scene="9" value="/rayTracerScenes/skybox.yaml">Skybox</option>
    </select>
    <button id="gobutton">go!</button>
<br>
<button id="leftbutton">left</button>
<button id="rightbutton">right</button>
<br>
<canvas id="outCanvas"></canvas>
<script id="rayTracer" src="/js/rayTracerPage.js"></script>

</body>

</html>
