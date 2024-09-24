import { FC, useState } from "react";
import {
	IoCloseOutline,
	IoContractOutline,
	IoExpandOutline,
	IoRemove,
} from "react-icons/io5";

const { getCurrentWindow, app } = window.require("@electron/remote");

export const Titlebar: FC = () => {
	const currentWindow = getCurrentWindow();
	const [maximized, setMaximized] = useState(currentWindow.isMaximized());

	const onMinimize = () => currentWindow.minimize();
	const onMaximize = () => {
		setMaximized(!currentWindow.isMaximized());
		currentWindow.isMaximized()
			? currentWindow.unmaximize()
			: currentWindow.maximize();
	};
	const onQuit = () => app.quit();

	return (
		<div className="title-bar sticky top-0 select-none">
			<div className="window-controls-container">
				<button
					title="Close"
					className="close-button focus:outline-none hover:bg-gray-700"
					onClick={onQuit}
				>
					<IoCloseOutline />
				</button>
				<button
					title="Minimize"
					className="minimize-button focus:outline-none hover:bg-gray-700"
					onClick={onMinimize}
				>
					<IoRemove />
				</button>
				<button
					title="Maximize"
					className="min-max-button focus:outline-none hover:bg-gray-700"
					onClick={onMaximize}
				>
					{maximized ? <IoContractOutline /> : <IoExpandOutline />}
				</button>
			</div>
		</div>
	);
};

