const { BrowserWindow, ipcMain } = require("electron")
const { channels } = require("../../src/shared/constants")
const path = require("path")
const os = require("os")
const fs = require("fs")
const { Buffer } = require("buffer")
const { parseBuffer } = require("music-metadata-browser")
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
							fs.stat(filePath, async (err, stats) => {
								if (err) {
									resolve(null) // Пропускаем файлы, которые не удалось проверить
									return
								}

								// Если это директория, добавляем в результат
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
									// Если это аудиофайл, пытаемся прочитать его метаданные
									try {
										const fileBuffer =
											fs.readFileSync(filePath)
										const metadata = await parseBuffer(
											fileBuffer,
										)
										const title =
											metadata.common.title || file // Название трека, если доступно, иначе имя файла
										const artist =
											metadata.common.artist ||
											"Unknown Artist" // Артист, если доступен
										const duration =
											Math.round(
												metadata.format.duration,
											) || 0 // Длительность трека в секундах

										// Получение обложки
										let coverUrl = null
										if (
											metadata.common.picture &&
											metadata.common.picture.length > 0
										) {
											const cover =
												metadata.common.picture[0] // Первая картинка (обычно это обложка альбома)
											const base64Cover =
												cover.data.toString("base64") // Преобразуем данные картинки в base64
											coverUrl = `data:${cover.format};base64,${base64Cover}` // Создаем data-URL для изображения
										}

										resolve({
											type: "audio",
											name: title, // Название трека
											artist: artist, // Артист
											path: filePath, // Путь к файлу
											cover: coverUrl, // Обложка
											duration: duration, // Длительность трека в секундах
											selected:false,
										})
									} catch (err) {
										console.error(
											`Ошибка чтения метаданных для файла ${filePath}:`,
											err,
										)
										resolve({
											type: "audio",
											name: file, // Если метаданные не удалось прочитать, используем имя файла
											artist: "Unknown Artist",
											path: filePath,
											cover: null, // Обложка недоступна
											duration: 0, // Если длительность неизвестна
											selected:false,
										})
									}
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

