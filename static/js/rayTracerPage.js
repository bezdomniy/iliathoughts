var goButton = document.getElementById("gobutton");
var leftButton = document.getElementById("leftbutton");
var rightButton = document.getElementById("rightbutton");
var textarea = document.getElementById("sceneTextArea");

function getCanvasSize(sceneDesc) {
  try {
    const doc = jsyaml.load(sceneDesc);

    var item;
    for (item of doc) {
      if (item["add"] == "camera") {
        return [item["width"], item["height"]];
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function updateRender(runner, pixelsToRender, ctx) {
  // var i;
  var bytes = runner.renderToRGBA(textarea.value, pixelsToRender);
  var imageData;

  imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Iterate through every pixel
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i] === 0) {
      // Modify pixel data
      imageData.data[i + 0] = bytes[i + 0]; // R value
      imageData.data[i + 1] = bytes[i + 1]; // G value
      imageData.data[i + 2] = bytes[i + 2]; // B value
      imageData.data[i + 3] = 255; // A value
    }
  }
  // Draw image data to the canvas
  ctx.putImageData(imageData, 0, 0);
}

Module["onRuntimeInitialized"] = function () {
  console.log("loaded");
  // TODO put this into a web worker
  const runner = new Module.EmscriptenRunner();

  // TODO - to make this work, camera state needs to be in JS
  var repeatLeft = function (action) {
    runner.moveLeft();
    // t = setTimeout(repeatLeft, updateTime);
  };
  var repeatRight = function (action) {
    runner.moveRight();
    // t = setTimeout(repeatRight, updateTime);
  };

  goButton.addEventListener("click", function () {
    const widthHeight = getCanvasSize(textarea.value);

    // const widthHeight = [600, 200];

    const canvas = document.getElementById("outCanvas");
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = widthHeight[0];
    ctx.canvas.height = widthHeight[1];
    ctx.createImageData(ctx.canvas.width, ctx.canvas.height);

    // var pixelsToRender = new Uint8Array(widthHeight[0] * widthHeight[1]);

    var firstBatch = new Uint8Array(widthHeight[0] * widthHeight[1]);
    var secondBatch = new Uint8Array(widthHeight[0] * widthHeight[1]);

    for (var i = 0; i < firstBatch.length; i++) {
      if (i % 2 == 0) {
        firstBatch[i] = 49;
        secondBatch[i] = 48;
      } else {
        firstBatch[i] = 48;
        secondBatch[i] = 49;
      }
    }

    updateRender(runner, firstBatch, ctx);
    updateRender(runner, secondBatch, ctx);

    // let showImg = setInterval(updateRender, updateTime);
  });

  leftButton.addEventListener("mousedown", function () {
    repeatLeft();
  });
  rightButton.addEventListener("mousedown", function () {
    repeatRight();
  });
  leftButton.addEventListener("mouseup", function () {
    clearTimeout(t);
  });
  rightButton.addEventListener("mouseup", function () {
    clearTimeout(t);
  });
};

function setScene() {
  // find the dropdown
  var ddl = document.getElementById("scenes");
  // find the selected option
  var selectedOption = ddl.options[ddl.selectedIndex];
  // find the attribute value
  var sceneValue = selectedOption.getAttribute("value");
  // find the textbox
  var textBox = document.getElementById("sceneTextArea");
  fetch(sceneValue)
    .then((response) => response.text())
    .then((data) => {
      textBox.value = data;
    });
}
