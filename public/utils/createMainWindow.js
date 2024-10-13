const { BrowserWindow, ipcMain } = require("electron")
const { channels } = require("../../src/shared/constants")
const path = require("path")
const os = require("os")
const fs = require("fs")
const { join } = require("path")
const { autoUpdater } = require("electron-updater")
const remote = require("@electron/remote/main")
const config = require("./config")
const CacheStore = require("./cacheStore")

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
			e.preventDefault()

			window.hide()
		}
	})

	const audioExtensions = [".mp3", ".wav", ".flac", ".ogg", ".aac"]

	ipcMain.on(channels.GET_DIR, async (event, arg) => {
		try {
			// Если аргумент не передан или не содержит "dir", используем домашнюю директорию
			const directoryPath = arg && arg.dir ? arg.dir : os.homedir()

			// Чтение содержимого директории
			fs.readdir(directoryPath, (err, files) => {
				if (err) {
					console.error("Не удалось сканировать директорию: ", err)
					event.reply(
						"directory-error",
						"Не удалось сканировать директорию",
					)
					return
				}

				// Используем Promise.all, чтобы асинхронно проверять каждый файл
				Promise.all(
					files.map((file) => {
						// Игнорируем файлы, которые начинаются с точки
						if (file.startsWith(".") || file.startsWith("$")) {
							return Promise.resolve(null)
						}

						const filePath = path.join(directoryPath, file)

						return new Promise((resolve) => {
							fs.stat(filePath, (err, stats) => {
								if (err) {
									resolve(null) // Пропускаем файлы, которые не удалось проверить
									return
								}

								// Если это директория или файл с аудио расширением, добавляем в результат
								if (stats.isDirectory()) {
									resolve({
										type: "directory",
										name: file,
										path: filePath,
									})
								} else if (
									audioExtensions.includes(
										path.extname(file).toLowerCase(),
									)
								) {
									resolve({ type: "audio", name: file })
								} else {
									resolve(null) // Пропускаем файлы, которые не директории или не аудиофайлы
								}
							})
						})
					}),
				).then((results) => {
					// Очищаем результат от null и отправляем только директории и аудиофайлы
					const filteredFiles = results.filter(
						(item) => item !== null,
					)
					event.reply("directory-files", filteredFiles, directoryPath)
				})
			})
		} catch (err) {
			console.error("Не удалось сканировать директорию: ", err)
			event.reply("directory-error", "Не удалось сканировать директорию")
		}
	})

	const cache = new CacheStore({
		configName: "user-preferences",
		defaults: {
			favoriteDirs: [],
		},
	})

	// Получение массива
	ipcMain.on(channels.GET_FAVORITES, async (event) => {
		try {
			// Получаем favoriteDirs из кэша
			const favoriteDirs = cache.get("favoriteDirs")
			cache.log()
			console.log(favoriteDirs, "favoritedirsss")

			// Отправляем результат обратно в рендер-процесс
			event.reply(channels.GET_FAVORITES, favoriteDirs)
		} catch (error) {
			console.error("Error fetching favoriteDirs:", error)
			// Отправляем ошибку обратно в рендер-процесс
			event.reply(channels.GET_FAVORITES, {
				error: "Failed to retrieve favorite directories",
			})
		}
	})

	// Добавление директории в массив
	ipcMain.on(channels.ADD_FAVORITE, (event, dirPath) => {
		try {
			cache.addToArray("favoriteDirs", {
				path: dirPath,
				name: path.basename(dirPath),
			})
		} catch (error) {
			console.error("Error adding favoriteDirs:", error)
		}
	})

	// Удаление директории из массива
	ipcMain.on(channels.DELETE_FAVORITE, (event, dirPath) => {
		// cache.removeFromArray("favoriteDirs", dirPath);
		// return cache.get("favoriteDirs");
		try {
			cache.removeFromArray("favoriteDirs", dirPath)
		} catch (error) {
			console.error("Error deleting favoriteDirs:", error)
		}
	})

	return window
}

