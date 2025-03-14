import { FC, useState } from "react"

import { observer } from "mobx-react-lite"

import { Button } from "antd"
import { FaSpotify } from "react-icons/fa"
import {
	IoCloseOutline,
	IoContractOutline,
	IoExpandOutline,
	IoPlaySharp,
	IoRemove,
} from "react-icons/io5"
import { useLocation, useNavigate } from "react-router-dom"

import { useStores } from "store"

import "./index.scss"

const { getCurrentWindow } = window.require("@electron/remote")

export const Titlebar: FC = observer(() => {
	const { ThemeStore } = useStores()
	const location = useLocation()
	const redirect = useNavigate()

	const currentWindow = getCurrentWindow()
	const [maximized, setMaximized] = useState(currentWindow.isMaximized())
	const onMinimize = () => currentWindow.minimize()
	const onMaximize = () => {
		setMaximized(!currentWindow.isMaximized())
		currentWindow.isMaximized()
			? currentWindow.unmaximize()
			: currentWindow.maximize()
	}
	const onQuit = () => {
		// Закрыть текущее окно
		currentWindow.close()
	}

	return (
		<div
			className="title-bar sticky top-0 select-none"
			style={{
				backgroundColor: ThemeStore.CurrentTheme.backgroundColor,
				borderColor: ThemeStore.CurrentTheme.borderColor,
				color: ThemeStore.CurrentTheme.fontColor,
			}}
		>
			<div className="window-controls-container">
				<button
					title="Close"
					className="close-button focus:outline-none"
					onClick={onQuit}
				>
					<IoCloseOutline />
				</button>
				<button
					title="Minimize"
					className="minimize-button focus:outline-none"
					onClick={onMinimize}
				>
					<IoRemove />
				</button>
				<button
					title="Maximize"
					className="min-max-button focus:outline-none"
					onClick={onMaximize}
				>
					{maximized ? <IoContractOutline /> : <IoExpandOutline />}
				</button>
				<Button
					className={
						ThemeStore.CurrentTheme.name ===
						ThemeStore.DarkTheme.name
							? "spotify-button dark"
							: "spotify-button"
					}
					size="small"
					disabled
					type="default"
					icon={
						location.pathname === "/spotify-page" ? (
							<IoPlaySharp />
						) : (
							<FaSpotify />
						)
					}
					onClick={() =>
						location.pathname === "/spotify-page"
							? redirect("/")
							: redirect("/spotify-page")
					}
				>
					{location.pathname === "/spotify-page"
						? "Go to player"
						: "Go to spotify"}
				</Button>
			</div>
		</div>
	)
})
