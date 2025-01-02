const { join } = require("path");
const isDev = require("electron-is-dev");

let config = {
	appName: "Desktop Music Player",
	icon: join(__dirname, "..", "/icons.icns"),
	tray: null,
	isQuiting: false,
	mainWindow: null,
	popupWindow: null,
	isDev,
};

module.exports = config;
