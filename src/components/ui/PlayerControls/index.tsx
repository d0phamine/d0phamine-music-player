import { FC } from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "store"
import {
	MdPlayCircle,
	MdSkipNext,
	MdSkipPrevious,
	MdPauseCircle,
	MdShuffle,
	MdRepeat,
} from "react-icons/md"

import "./index.scss"

export interface IPlayerControlsProps {
	previousFs?: string
	playFs?: string
	nextFs?: string
	shuffleFs?: string
	repeatFs?: string
	playMode?: boolean
	previousFunc?: () => void
	nextFunc?: () => void
	playFunc?: () => void
}

export const PlayerControls: FC<IPlayerControlsProps> = observer(
	({
		previousFs = "24px",
		playFs = "32px",
		nextFs = "24px",
		shuffleFs = "24px",
		repeatFs = "24px",
		playMode = false,
	}) => {
		const { PlayerStore } = useStores()

		const getStyle = (isActive: boolean, fontSize: string) => ({
			cursor: "pointer",
			fontSize,
			color: isActive ? "#6f56d0" : undefined,
		})

		return (
			<div className="player-controls">
				{playMode && (
					<MdShuffle
						style={getStyle(
							PlayerStore.playerData.isShuffled,
							shuffleFs,
						)}
						onClick={() => {
							if (PlayerStore.playerData.isShuffled) {
								PlayerStore.unShufflePlaylist()
								PlayerStore.setSelectedTrackInCurrentPlaylist(
									PlayerStore.playerData.currentPlaylist[0],
								)
							} else {
								PlayerStore.shufflePlaylist()
								PlayerStore.setSelectedTrackInCurrentPlaylist(
									PlayerStore.playerData.currentPlaylist[0],
								)
							}
						}}
					/>
				)}
				<MdSkipPrevious
					style={getStyle(false, previousFs)}
					onClick={() => {
						PlayerStore.setSelectedTrackInCurrentPlaylist(
							undefined,
							"previous",
						)
					}}
				/>
				{PlayerStore.playerData.isPlaying ? (
					<MdPauseCircle
						style={getStyle(false, playFs)}
						onClick={() => PlayerStore.changeIsPlaying()}
					/>
				) : (
					<MdPlayCircle
						style={getStyle(false, playFs)}
						onClick={() => PlayerStore.changeIsPlaying()}
					/>
				)}

				<MdSkipNext
					style={getStyle(false, nextFs)}
					onClick={() => {
						PlayerStore.setSelectedTrackInCurrentPlaylist(
							undefined,
							"next",
						)
					}}
				/>
				{playMode && (
					<MdRepeat
						style={getStyle(
							PlayerStore.playerData.isLooped,
							repeatFs,
						)}
						onClick={() => PlayerStore.changeIsLooped()}
					/>
				)}
			</div>
		)
	},
)
