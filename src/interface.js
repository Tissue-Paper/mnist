const INPUT_WIDTH = 28;
const INPUT_HEIGHT = 28;
const INPUT_INNER_SIZE = 20;

window.addEventListener("load", () => {
	const CANVAS_SIZE = wrapper.getBoundingClientRect().width;
	const button = document.querySelectorAll("button");
	const canvas = new fabric.Canvas("c", {
		isDrawingMode	: true,
		backgroundColor	: "#fff",
		width			: CANVAS_SIZE,
		height			: CANVAS_SIZE,
	});
	canvas.freeDrawingBrush.width = CANVAS_SIZE * 0.04;

	button[0].addEventListener("click", () => {
		result.innerHTML = "";
		canvas.clear().set("backgroundColor", "#fff").renderAll();
	});

	button[1].addEventListener("click", () => {
		const input = new InputData();
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

			td1.innerHTML = indices[i];
			div.innerHTML = div.style.width = probability + "%";
			result.appendChild(tr);
			tr.appendChild(td1);
			tr.appendChild(td2);
			td2.appendChild(div);
		}
		//showImage(input);
	});
});

function showImage(data) {
	const canvas = new Canvas(INPUT_WIDTH, INPUT_HEIGHT);
	const imageData = canvas.ctx.createImageData(INPUT_WIDTH, INPUT_HEIGHT);

	for (let i = 0; i < data.length; i++) {
		const value = Math.round(data[i] * 255);
		const j = i * 4;
		imageData.data[j + 0] = value;
		imageData.data[j + 1] = value;
		imageData.data[j + 2] = value;
		imageData.data[j + 3] = 255;
	}
	canvas.ctx.putImageData(imageData, 0, 0);

	for (let e of document.querySelectorAll(".input")) {
		e.parentNode.removeChild(e);
	}
	canvas.classList.add("input");
	wrapper.appendChild(canvas);
}