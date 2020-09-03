---
title: "Ray Tracer"
date: 2020-01-01T14:08:06+11:00
tags: ["ray tracer", "ray tracer challenge", "webassembly", "emscripten", "C++"]
draft: false
---

<!DOCTYPE HTML>
<html>
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
<canvas id="canvas"></canvas>
<script id="jsscript" src="/js/Runner.js"></script>
<script>
    // Module({
    //     canvas: (() => document.getElementById('canvas'))(),
    // });
    Module["onRuntimeInitialized"] = function () {
        Module.canvas = (() => document.getElementById('canvas'))();
        var goButton = document.getElementById("gobutton");
        goButton.addEventListener(
            "click", function() {
            Module._mainf();
            // Module.ccall('mainf', null, null, null);
            }
        );
    };
</script>
</body>
</html>
