import { FC } from "react"
import { Modal } from "antd"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../store"
import { TrackProgressBar, PlayerControls } from "../../ui"
import { MdLyrics } from "react-icons/md";
import { CSSProperties } from "react"

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
					<div></div>
					<PlayerControls
						nextFs="48px"
						previousFs="48px"
						playFs="64px"
						playMode
					/>
					<div className="content-cover__lyrics-button">
						<MdLyrics style={{ fontSize: "24px" }} />
					</div>
				</div>
			</div>
		</Modal>
	)
})

