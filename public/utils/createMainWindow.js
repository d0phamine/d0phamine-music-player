const { BrowserWindow, ipcMain } = require("electron");
const { channels } = require("../../src/shared/constants");
const path  = require("path");
const fs = require("fs").promises;
const { join } = require("path");
const { autoUpdater } = require("electron-updater");
const remote = require("@electron/remote/main");
const config = require("./config");

exports.createMainWindow = async () => {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			devTools: config.isDev,
			contextIsolation: false,
		},
		frame: false,
		icon: config.icon,
		title: config.appName,
	});

	remote.enable(window.webContents);

	await window.loadURL(
		config.isDev
			? "http://localhost:3000"
			: `file://${join(__dirname, "..", "../build/index.html")}`,
	);

	window.once("ready-to-show", () => {
		autoUpdater.checkForUpdatesAndNotify();
	});

	window.on("close", (e) => {
		if (!config.isQuiting) {
			e.preventDefault();

			window.hide();
		}
	});

	ipcMain.on(channels.GET_DIR, async (event, arg) => {
		const arrDirs = []
		try {
			console.log(arg.dir, "args")
			const directoryPath = path.join(__dirname, arg.dir);
			console.log(directoryPath, "directorypath")
			const files = await fs.readdir(directoryPath); // Await fs.promises.readdir


			files.forEach((file) => {
				arrDirs.push(file)
			});

			event.reply("directory-files", files); // You can reply with the files if needed
		} catch (err) {
			console.error("Unable to scan directory: ", err);
			event.reply("directory-error", "Unable to scan directory");
		}
	});

	return window;
};

