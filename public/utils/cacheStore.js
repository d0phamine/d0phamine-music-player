const electron = require('electron');
const path = require('path');
const fs = require('fs');

class CacheStore {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    
    this.data = parseDataFile(this.path, opts.defaults);
  }

  // Получение данных
  get(key) {
    return this.data[key];
  }

  // Установка данных
  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  // Добавление элемента в массив
  addToArray(key, value) {
    if (!this.data[key]) {
      this.data[key] = [];
    }
    if (!this.data[key].includes(value)) {
      this.data[key].push(value);
      this.set(key, this.data[key]); // Сохранить обновлённый массив
    }
  }

  // Удаление элемента из массива
  removeFromArray(key, value) {
    if (this.data[key]) {
      this.data[key] = this.data[key].filter(item => item !== value);
      this.set(key, this.data[key]); // Сохранить обновлённый массив
    }
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}

module.exports = CacheStore;