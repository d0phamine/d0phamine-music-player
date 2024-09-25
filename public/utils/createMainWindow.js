const { BrowserWindow, ipcMain } = require("electron");
const { channels } = require("../../src/shared/constants");
const path = require("path");
const os = require("os");
const fs = require("fs");
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

	const audioExtensions = [".mp3", ".wav", ".flac", ".ogg", ".aac"];

	ipcMain.on(channels.GET_DIR, async (event, arg) => {
		try {
			// Если аргумент не передан или не содержит "dir", используем домашнюю директорию
			const directoryPath = arg && arg.dir ? arg.dir : os.homedir();

			// Чтение содержимого директории
			fs.readdir(directoryPath, (err, files) => {
				if (err) {
					console.error("Не удалось сканировать директорию: ", err);
					event.reply(
						"directory-error",
						"Не удалось сканировать директорию",
					);
					return;
				}

				// Используем Promise.all, чтобы асинхронно проверять каждый файл
				Promise.all(
					files.map((file) => {
						// Игнорируем файлы, которые начинаются с точки
						if (file.startsWith(".")) {
							return Promise.resolve(null);
						}

						const filePath = path.join(directoryPath, file);

						return new Promise((resolve) => {
							fs.stat(filePath, (err, stats) => {
								if (err) {
									resolve(null); // Пропускаем файлы, которые не удалось проверить
									return;
								}

								// Если это директория или файл с аудио расширением, добавляем в результат
								if (stats.isDirectory()) {
									resolve({ type: "directory", name: file });
								} else if (
									audioExtensions.includes(
										path.extname(file).toLowerCase(),
									)
								) {
									resolve({ type: "audio", name: file });
								} else {
									resolve(null); // Пропускаем файлы, которые не директории или не аудиофайлы
								}
							});
						});
					}),
				).then((results) => {
					// Очищаем результат от null и отправляем только директории и аудиофайлы
					const filteredFiles = results.filter(
						(item) => item !== null,
					);
					event.reply("directory-files", filteredFiles);
				});
			});
		} catch (err) {
			console.error("Не удалось сканировать директорию: ", err);
			event.reply("directory-error", "Не удалось сканировать директорию");
		}
	});

	return window;
};

