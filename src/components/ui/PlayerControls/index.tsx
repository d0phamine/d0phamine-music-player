import { FC } from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../store"
import {
	MdPlayCircle,
	MdSkipNext,
	MdSkipPrevious,
	MdPauseCircle,
} from "react-icons/md"

import "./index.scss"

export interface IPlayerControlsProps {
	previousFs?: string
	playFs?: string
	nextFs?: string
	previousFunc?: () => void
	nextFunc?: () => void
	playFunc?: () => void
}

export const PlayerControls: FC<IPlayerControlsProps> = observer(
	({
		previousFs = "24px",
		playFs = "32px",
		nextFs = "24px",
		previousFunc,
		nextFunc,
		playFunc,
	}) => {
		const { PlayerStore } = useStores()
		return (
			<div className="player-controls">
				<MdSkipPrevious
					style={{ fontSize: previousFs, cursor: "pointer" }}
					onClick={() => {
						PlayerStore.setSelectedTrackInCurrentPlaylist(
							undefined,
							"previous",
						)
					}}
				/>
				{PlayerStore.playerData.isPlaying ? (
					<MdPauseCircle
						style={{ fontSize: playFs, cursor: "pointer" }}
						onClick={() => PlayerStore.changeIsPlaying()}
					/>
				) : (
					<MdPlayCircle
						style={{ fontSize: playFs, cursor: "pointer" }}
						onClick={() => PlayerStore.changeIsPlaying()}
					/>
				)}

				<MdSkipNext
					style={{ fontSize: nextFs, cursor: "pointer" }}
					onClick={() => {
						PlayerStore.setSelectedTrackInCurrentPlaylist(
							undefined,
							"next",
						)
					}}
				/>
			</div>
		)
	},
)

