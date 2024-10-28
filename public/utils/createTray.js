const { app, Tray, Menu, shell } = require("electron");
const { showNotification } = require("./showNotification");
const config = require("./config");

exports.createTray = () => {
	const t = new Tray(config.icon);

	t.setToolTip(config.appName);
	t.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: "Show App",
				click: () => {
					if (!config.mainWindow.isVisible())
						config.mainWindow.show();
				},
			},
			{
				label: "Creator",
				submenu: [
					{
						label: "GitHub @d0phamine",
						click: () => {
							shell.openExternal("https://github.com/d0phamine");
						},
					},
				],
			},
			{
				label: "Send Notification",
				click: () =>
					showNotification(
						"This Notification Comes From Tray",
					),
			},
			{
				label: "Quit",
				click: () => {
					config.isQuiting = true;
					app.quit();
				},
			},
		]),
	);

	return t;
};
