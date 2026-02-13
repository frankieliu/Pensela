const { ipcRenderer } = require("electron");

let boardState = {
	col: "#b4deff",
	strokeCol: "#b4deff",
	mode: "mouse",
	bg: "#00000000",
	before: [],
	after: [],
	strokeWidth: 5,
	opacity: 0.5,
};

ipcRenderer.on("setMode", (e, arg) => {
	boardState.mode = arg;
});

ipcRenderer.on("colSelectFill", (e, arg) => {
	boardState.col = "#" + arg;
});

ipcRenderer.on("colSelectStroke", (e, arg) => {
	boardState.strokeCol = "#" + arg;
});

ipcRenderer.on("strokeIncrease", () => {
	if (boardState.strokeWidth < 10) boardState.strokeWidth += 1;
	ipcRenderer.send("strokeWidthChanged", boardState.strokeWidth);
});

ipcRenderer.on("strokeDecrease", () => {
	if (boardState.strokeWidth > 2) boardState.strokeWidth -= 1;
	ipcRenderer.send("strokeWidthChanged", boardState.strokeWidth);
});

ipcRenderer.on("strokeWidthSet", (e, size) => {
	boardState.strokeWidth = size;
});

ipcRenderer.on("opacityChanged", (e, opacity) => {
	boardState.opacity = opacity;
});
