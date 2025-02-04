import { CSSProperties, FC, useEffect, useState } from "react"

import { observer } from "mobx-react-lite"

import { Modal } from "antd"
import { AnimatePresence, motion } from "motion/react"

import { useStores } from "store"

import { LyricsIcon, TrackLyrics } from "components/logic"
import { PlayerControls, TrackProgressBar } from "components/ui"

import "./index.scss"

export const BigPlayer: FC = observer(() => {
	const { ComponentStore, PlayerStore, ThemeStore, TextylStore } = useStores()
	const [maskStyles, setMaskStyles] = useState({
		mask: { backgroundColor: "rgba(65, 65, 65, 0.2)", transition: "unset" },
	})
	const selectedTrack = PlayerStore.playerData.selectedTrack

	const trackName =
		PlayerStore.playerData.selectedTrack == null
			? "----"
			: PlayerStore.playerData.selectedTrack.artist
				? `${PlayerStore.playerData.selectedTrack.artist} - ${PlayerStore.playerData.selectedTrack.name}`
				: PlayerStore.playerData.selectedTrack.name

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

	useEffect(() => {
		if (ComponentStore.componentData.BigPlayerOpen) {
			setMaskStyles({
				mask: {
					backgroundColor: ComponentStore.componentData
						.BigPlayerCoverMainColor
						? `rgba(${ComponentStore.componentData.BigPlayerCoverMainColor[0]},
                        ${ComponentStore.componentData.BigPlayerCoverMainColor[1]},
                        ${ComponentStore.componentData.BigPlayerCoverMainColor[2]},
                        0.2)`
						: "rgba(65, 65, 65, 0.2)",
					transition: "1s",
				},
			})
		}
	}, [
		ComponentStore.componentData.BigPlayerOpen,
		ComponentStore.componentData.BigPlayerCoverMainColor,
	])

	useEffect(() => {
		if (!TextylStore.textylData.lyrics) {
			ComponentStore.changeBigPlayerLyricsOpen(false)
		}
	}, [TextylStore.textylData.lyrics])

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
					<div className="content-trackName">{trackName}</div>
				</div>
			}
			width={"100%"}
			closable={false}
			styles={maskStyles}
		>
			<div className="modal-container">
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
							<LyricsIcon />
						</div>
					</motion.div>
				</div>
				<AnimatePresence>
					{ComponentStore.componentData.BigPlayerLyricsOpen && (
						<motion.div
							className="big-player__lyrics-container"
							initial={{ opacity: 0 }}
							animate={{
								opacity: 1,
								width: "384px",
								height: "360px",
							}}
							exit={{
								opacity: 0,
								width: 0,
								height: 0,
							}}
							transition={{ duration: 0.3, ease: "linear" }}
							key="box"
							onAnimationComplete={() =>
								TextylStore.changeLyricsAppear()
							}
						>
							<TrackLyrics />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</Modal>
	)
})
