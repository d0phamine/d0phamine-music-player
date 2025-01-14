import { FC, CSSProperties } from "react"
import { observer } from "mobx-react-lite"
import { Modal } from "antd"
import { motion, AnimatePresence } from "motion/react"

import { useStores } from "store"
import { TrackProgressBar, PlayerControls } from "components/ui"
import { TrackLyrics } from "components/logic"
import { MdLyrics } from "react-icons/md"

import "./index.scss"

export const BigPlayer: FC = observer(() => {
	const { ComponentStore, PlayerStore, ThemeStore, TextylStore } = useStores()
	const selectedTrack = PlayerStore.playerData.selectedTrack

	const afterBgColor =
		ThemeStore.CurrentTheme.name === "LightTheme"
			? "rgba(255, 255, 255, 0.6)" // Белый полупрозрачный цвет для светлой темы
			: "rgba(0, 0, 0, 0.6)" // Черный полупрозрачный цвет для темной темы

	const contentCoverStyle: CSSProperties & { "--after-bg-color": string } = {
		"--after-bg-color": afterBgColor,
		backgroundImage: selectedTrack?.cover
			? `url(${selectedTrack.cover})`
			: "none",
		backgroundColor: selectedTrack?.cover ? "transparent" : "gray",
	}

	const modalContainerStyle: CSSProperties = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "12px",
		padding: "12px",
	}

	return (
		<Modal
			className="big-player"
			centered
			open={ComponentStore.componentData.BigPlayerOpen}
			onCancel={() => ComponentStore.changeBigPlayerOpen()}
			footer={
				<div className="footer-container">
					<TrackProgressBar
						howlerRef={ComponentStore.componentData.howlerRef}
					/>
					<div className="content-trackName">
						{PlayerStore.playerData.selectedTrack == null
							? "----"
							: PlayerStore.playerData.selectedTrack.artist
							? `${PlayerStore.playerData.selectedTrack.artist} - ${PlayerStore.playerData.selectedTrack.name}`
							: PlayerStore.playerData.selectedTrack.name}
					</div>
				</div>
			}
			width={"100%"}
			closable={false}
		>
			<div className="modal-container" style={modalContainerStyle}>
				<div className="big-player__content">
					<motion.div
						className="content-cover"
						style={contentCoverStyle}
						animate={{
							width: ComponentStore.componentData
								.BigPlayerCoverSize,
							height: ComponentStore.componentData
								.BigPlayerCoverSize,
						}}
						transition={{ duration: 0.3, ease: "linear" }}
					>
						<div></div>
						<PlayerControls
							nextFs="48px"
							previousFs="48px"
							playFs="64px"
							playMode
						/>
						<div className="content-cover__lyrics-button">
							<MdLyrics
								style={{
									fontSize: "24px",
									color: ComponentStore.componentData
										.BigPlayerLyricsOpen
										? ThemeStore.CurrentTheme.primaryColor
										: TextylStore.textylData.lyrics
										? ThemeStore.CurrentTheme.fontColor
										: ThemeStore.CurrentTheme.disabledColor,
									cursor: TextylStore.textylData.lyrics
										? "pointer"
										: "unset",
									transition: "0.3s",
								}}
								onClick={() => {
									if (TextylStore.textylData.lyrics) {
										ComponentStore.changeBigPlayerLyricsOpen()
									}
								}}
							/>
						</div>
					</motion.div>
				</div>
				<AnimatePresence>
					{ComponentStore.componentData.BigPlayerLyricsOpen && (
						<motion.div
							className="big-player__lyrics-container"
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0 }}
							transition={{ duration: 0.3, ease: "linear" }}
							key="box"
						>
							<TrackLyrics />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</Modal>
	)
})

