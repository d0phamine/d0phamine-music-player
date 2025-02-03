const electron = require("electron")
const path = require("path")
const fs = require("fs")

class CacheStore {
	constructor(opts) {
		const userDataPath = (electron.app || electron.remote.app).getPath(
			"userData",
		)
		this.path = path.join(userDataPath, opts.configName + ".json")

		this.data = parseDataFile(this.path, opts.defaults)
	}
	log() {
		console.log(this.path)
	}
	// Получение данных
	get(key) {
		return this.data[key]
	}

	// Установка данных
	set(key, val) {
		this.data[key] = val
		fs.writeFileSync(this.path, JSON.stringify(this.data))
	}

	// Добавление элемента в массив
	addToArray(key, value) {
		if (!this.data[key]) {
			this.data[key] = [] // Инициализация массива, если его нет
		}

		// Проверка на существование объекта с таким же ключом и значением
		const exists = this.data[key].some((item) =>
			Object.entries(value).every(([k, v]) => item[k] === v),
		)

		if (!exists) {
			this.data[key].push(value)
			this.set(key, this.data[key]) // Сохранить обновлённый массив
		}
	}

	// Удаление элемента из массива
	removeFromArray(key, value) {
		if (this.data[key]) {
			this.data[key] = this.data[key].filter(
				(item) => item.path !== value,
			)
			this.set(key, this.data[key]) // Сохранить обновлённый массив
		}
	}
}

function parseDataFile(filePath, defaults) {
	try {
		const fileData = fs.readFileSync(filePath, "utf-8")

		const parsedData = JSON.parse(fileData)

		return parsedData
	} catch (error) {
		return defaults
	}
}

module.exports = CacheStore
