function Canvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function InputData() {
  // Cut out only the character area and make it data of long side by long side
  const border = c.getContext("2d").getBorder();
  const canvasV1 = new Canvas(border.size, border.size);
  canvasV1.ctx.fillCanvas("#fff");
  canvasV1.ctx.drawImage(c, border.left, border.top, border.width, border.height, 0, 0, border.width, border.height);

  // Downscale to 20px by 20px
  canvasV1.ctx.downScaleTo(INPUT_INNER_SIZE, 1.5);

  // Generate data of 28px by 28px and transfer so that the center of gravity is centered
  const canvasV2 = new Canvas(INPUT_WIDTH, INPUT_HEIGHT);
  const center = canvasV2.ctx.getCenter();
  const cog = canvasV1.ctx.getCenterOfGravity();
  canvasV2.ctx.fillCanvas("#fff");
  canvasV2.ctx.drawImage(canvasV1, Math.round(center.x - cog.x), Math.round(center.y - cog.y));

  return canvasV2.ctx.optimization();
}

CanvasRenderingContext2D.prototype.fillCanvas = function(color = "#fff") {
  this.fillStyle = color;
  this.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderingContext2D.prototype.downScaleTo = function(size, ratio = 2) {
  const canvas = this.canvas;
  const tmpCanvas = new Canvas(canvas.width, canvas.height);
  const calc = size => Math.ceil(size / ratio);
  let tmpSize = canvas.width;

  if (canvas.width <= size || ratio <= 1) return;
  tmpCanvas.ctx.drawImage(canvas, 0, 0);

  while (calc(tmpSize) > size) {
    tmpCanvas.ctx.drawImage(tmpCanvas, 0, 0, tmpSize, tmpSize, 0, 0, calc(tmpSize), calc(tmpSize));
    tmpSize = calc(tmpSize);
  }
  canvas.width = canvas.height = size;
  this.drawImage(tmpCanvas, 0, 0, tmpSize, tmpSize, 0, 0, size, size);
};

CanvasRenderingContext2D.prototype.getBorder = function() {
  const data = this.optimization();
  const width = this.canvas.width;
  const height = this.canvas.height;
  let border = {};

  border.top = (() => {
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++)
        if (data[width * y + x]) return y;
  })() || 0;

  border.left = (() => {
    for (let x = 0; x < width; x++)
      for (let y = 0; y < height; y++)
        if (data[width * y + x]) return x;
  })() || 0;

  border.right = (() => {
    for (let x = width; x--;)
      for (let y = height; y--;)
        if (data[width * y + x]) return x;  
  })() || 0;

  border.bottom = (() => {
    for (let y = height; y--;)
      for (let x = width; x--;)
        if (data[width * y + x]) return y;  
  })() || 0;

  border.width = border.right - border.left + 1;
  border.height = border.bottom - border.top + 1;
  border.size = Math.max(border.width, border.height);

  return border;
};

CanvasRenderingContext2D.prototype.getCenter = function() {
  return {
    x: this.canvas.width / 2,
    y: this.canvas.height / 2
  };
};

CanvasRenderingContext2D.prototype.getCenterOfGravity = function() {
  const data = this.optimization();
  const width = this.canvas.width;
  const height = this.canvas.height;
  let area = xk = yk = 0;

  for (let x = 0; x < width; x++) {
    let k = 0;
    for (let y = 0; y < height; y++) {
      k += data[width * y + x];
    }
    area += k;
    xk += x * k;
  }
  for (let y = 0; y < height; y++) {
    let k = 0;
    for (let x = 0; x < width; x++) {
      k += data[width * y + x];
    }
    yk += y * k;
  }

  return {x: xk / area, y: yk / area};
};

CanvasRenderingContext2D.prototype.optimization = function() {
  const data = this.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
  let grayscaleData = [];

  for (let i = 0; i < data.length; i += 4) {
    grayscaleData[i / 4] = 1 - data[i] / 255;
  }
  return grayscaleData;
};