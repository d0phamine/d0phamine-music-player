const { BrowserWindow, app } = require("electron")
const { join } = require("path")
const { autoUpdater } = require("electron-updater")
const remote = require("@electron/remote/main")
const config = require("./config")
const fsHandlers = require("../handlers/fsHandlers")

exports.createMainWindow = async () => {
	const window = new BrowserWindow({
		width: 850,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			devTools: config.isDev,
			contextIsolation: false,
			webSecurity: false,
		},
		frame: false,
		icon: config.icon,
		title: config.appName,
	})

	remote.enable(window.webContents)

	await window.loadURL(
		config.isDev
			? "http://localhost:3000"
			: `file://${join(__dirname, "..", "../build/index.html")}`,
	)

	window.once("ready-to-show", () => {
		autoUpdater.checkForUpdatesAndNotify()
	})

	window.on("close", (e) => {
		if (!config.isQuiting) {
			// Предотвратить закрытие окна
			e.preventDefault()
			window.hide()
		} else {
			// Завершить приложение, если config.isQuiting установлен в true
			app.quit()
		}
	})

	return window
}

