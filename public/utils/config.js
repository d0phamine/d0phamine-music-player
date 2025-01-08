const { resolve } = require("path")
const os = require("os")
const isDev = require("electron-is-dev")

const iconPath =
	os.platform() === "darwin"
		? resolve(__dirname, "../icons", "icon-mono_16x16@2x.png")
		: resolve(__dirname, "../icons", "icon_16x16@2x.png")

let config = {
	appName: "d0phamine music player",
	icon: iconPath,
	tray: null,
	isQuiting: false,
	mainWindow: null,
	popupWindow: null,
	isDev,
}

module.exports = config

