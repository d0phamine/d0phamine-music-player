const { join, resolve } = require("path");
const isDev = require("electron-is-dev");

const iconPath = resolve(__dirname, "..", "icon_16x16.png");

let config = {
    appName: "d0phamine music player",
    icon: iconPath,
    tray: null,
    isQuiting: false,
    mainWindow: null,
    popupWindow: null,
    isDev,
};

module.exports = config;

