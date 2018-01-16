
window.addEventListener("load", () => {
  const canvas = new fabric.Canvas("c", {
    width: 240,
    height: 240,
    isDrawingMode: true,
    backgroundColor: "transparent",
  });

  // Drawing style
  customizeFabric();
  canvas.freeDrawingBrush.width = 3;
  canvas.freeDrawingBrush.shadow = new fabric.Shadow({
    blur: 1,
    color: "blue",
  });

  // Sample charactor
  const text = new fabric.Text('A', {
    top: 37,
    left: 62,
    fontSize: 164,
    fontWeight: "100",
    fontFamily: "sans-serif"
  });
  canvas.add(text);

  document.querySelectorAll("button")[0].addEventListener("click", () => {
    canvas.clear().set("backgroundColor", "transparent").renderAll();
  });

  document.querySelectorAll("button")[1].addEventListener("click", () => {
    inputCanvas = preprocessing(c);
    const input = inputCanvas.data;
    const output = mnist_cnn(input);
    const indices = output[0].getValues();
    const values = output[1].getValues();

    result.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const div = document.createElement("div");
      const probability = (Math.round(values[i] * 1000) / 10);

      if (indices[i] < 26) {
        label = String.fromCharCode(indices[i] + 65);
      } else {
        label = String.fromCharCode(indices[i] + 71);
      }

      if (!i) outputLabel = label;
      if (probability) {
        td1.innerHTML = label;
        div.innerHTML = div.style.width = probability + "%";
      } else {
        td1.innerHTML = "&nbsp;";
      }
      result.appendChild(tr);
      tr.appendChild(td1);
      tr.appendChild(td2);
      td2.appendChild(div);
    }
    //showImage(inputCanvas);
  });
});



// Make the point expand
function customizeFabric() {
  fabric.PencilBrush.prototype.onMouseDown = function(pointer) {
    this.startPoint = pointer;
    this.dotOnlyFlg = true;

    this._prepareForDrawing(pointer);
    this._captureDrawingPath(pointer);
    this._render();
  };

  fabric.PencilBrush.prototype.onMouseMove = function(pointer) {
    this.dotOnlyFlg = false;

    this._captureDrawingPath(pointer);
    this.canvas.clearContext(this.canvas.contextTop);
    this._render();
  };

  fabric.PencilBrush.prototype.onMouseUp = function() {
    if (this.dotOnlyFlg) {
      const moves = [
        {x: 0,  y: -1},
        {x: 1,  y: 0},
        {x: 0,  y: 1},
        {x: -1, y: 0},
        {x: 0,  y: -1},
      ];
      for (let move of moves) {
        const pointer = {
          x: this.startPoint.x + move.x,
          y: this.startPoint.y + move.y,
        };
        this._captureDrawingPath(pointer);
      }
    }

    this._finalizeAndAddPath();
  };
}
