import { FC } from "react"
import { Modal } from "antd"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../store"
import { TrackProgressBar } from "../../ui"
import { CSSProperties } from "react"
import {
	MdPlayCircle,
	MdSkipNext,
	MdSkipPrevious,
	MdPauseCircle,
} from "react-icons/md"

import "./index.scss"

export const BigPlayer: FC = observer(() => {
	const { ComponentStore, PlayerStore, ThemeStore } = useStores()
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
			width={360}
			closable={false}
		>
			<div className="big-player__content">
				<div className="content-cover" style={contentCoverStyle}>
					<MdSkipPrevious
						style={{ fontSize: "48px", cursor: "pointer" }}
						onClick={() => {
							PlayerStore.setSelectedTrackInCurrentPlaylist(
								undefined,
								"previous",
							)
						}}
					/>
					{PlayerStore.playerData.isPlaying ? (
						<MdPauseCircle
							style={{ fontSize: "64px", cursor: "pointer" }}
							onClick={() => PlayerStore.changeIsPlaying()}
						/>
					) : (
						<MdPlayCircle
							style={{ fontSize: "64px", cursor: "pointer" }}
							onClick={() => PlayerStore.changeIsPlaying()}
						/>
					)}

					<MdSkipNext
						style={{ fontSize: "48px", cursor: "pointer" }}
						onClick={() => {
							PlayerStore.setSelectedTrackInCurrentPlaylist(
								undefined,
								"next",
							)
						}}
					/>
				</div>
			</div>
		</Modal>
	)
})

