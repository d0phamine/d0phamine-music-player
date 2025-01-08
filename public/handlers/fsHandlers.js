const { ipcMain } = require("electron")
const { channels } = require("../utils/constants")
const { parseBuffer } = require("music-metadata-browser")

const path = require("path")
const fs = require("fs")
const os = require("os")

const CacheStore = require("../cache/cacheStore")

const audioExtensions = [".mp3", ".wav", ".flac", ".ogg", ".aac"]

const cache = new CacheStore({
	configName: "user-preferences",
	defaults: {
		favoriteDirs: [],
	},
})

ipcMain.handle(channels.GET_DIR, async (event, arg) => {
	try {
		const directoryPath = arg && arg.dir ? arg.dir : os.homedir()

		const files = await fs.promises.readdir(directoryPath)
		const results = await Promise.all(
			files.map(async (file) => {
				if (file.startsWith(".") || file.startsWith("$")) {
					return null
				}

				const filePath = path.join(directoryPath, file)
				const stats = await fs.promises.stat(filePath)

				if (stats.isDirectory()) {
					return {
						type: "directory",
						name: file,
						path: filePath,
					}
				} else if (
					audioExtensions.includes(path.extname(file).toLowerCase())
				) {
					try {
						const fileBuffer = fs.readFileSync(filePath)
						const metadata = await parseBuffer(fileBuffer)
						const title = metadata.common.title || file
						const artist = metadata.common.artist || ""
						const duration =
							Math.round(metadata.format.duration) || 0

						let coverUrl = null
						if (
							metadata.common.picture &&
							metadata.common.picture.length > 0
						) {
							const cover = metadata.common.picture[0]
							const base64Cover = cover.data.toString("base64")
							coverUrl = `data:${cover.format};base64,${base64Cover}`
						}

						return {
							type: "audio",
							name: title,
							artist: artist,
							path: filePath,
							cover: coverUrl,
							duration: duration,
							selected: false,
						}
					} catch (err) {
						console.error(
							`Ошибка чтения метаданных для файла ${filePath}:`,
							err,
						)
						return {
							type: "audio",
							name: file,
							artist: "",
							path: filePath,
							cover: null,
							duration: 0,
							selected: false,
						}
					}
				} else {
					return null
				}
			}),
		)

		const filteredFiles = results.filter((item) => item !== null)
		return { receivedFiles: filteredFiles, path: directoryPath }
	} catch (err) {
		console.error("Не удалось сканировать директорию: ", err)
		throw new Error("Не удалось сканировать директорию")
	}
})

ipcMain.handle(channels.GET_FAVORITES, async () => {
    try {
        const favoriteDirs = cache.get("favoriteDirs");
        return favoriteDirs;
    } catch (error) {
        console.error("Error fetching favoriteDirs:", error);
        throw new Error("Failed to retrieve favorite directories");
    }
});

ipcMain.handle(channels.ADD_FAVORITE, async (event, dirPath) => {
    try {
        cache.addToArray("favoriteDirs", {
            path: dirPath,
            name: path.basename(dirPath),
        });
    } catch (error) {
        console.error("Error adding favoriteDirs:", error);
        throw new Error("Failed to add favorite directory");
    }
});

ipcMain.handle(channels.DELETE_FAVORITE, async (event, dirPath) => {
    try {
        cache.removeFromArray("favoriteDirs", dirPath);
    } catch (error) {
        console.error("Error deleting favoriteDirs:", error);
        throw new Error("Failed to delete favorite directory");
    }
});