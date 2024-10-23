import { FC } from "react"
import { observer } from "mobx-react-lite"

import ReactHowler from "react-howler"

import {
	MdPlayCircle,
	MdSkipNext,
	MdSkipPrevious,
	MdShuffle,
	MdRepeat,
	MdVolumeUp,
	MdPauseCircle,
} from "react-icons/md"

import { useStores } from "../../../store"
import { TrackProgressBar } from "../../ui"
// import { CustomIcon, CustomListItem, BrowserSearch } from "../.."

import "./index.scss"


export const TrackPlayer: FC = observer(() => {
	const { PlayerStore } = useStores()

	return (
		<div className="track-player">
			<div className="track-player__controls">
				<MdSkipPrevious
					style={{ fontSize: "24px", cursor: "pointer" }}
					onClick={() => {
						PlayerStore.setSelectedTrackInCurrentPlaylist(
							undefined,
							"previous",
						)
					}}
				/>
				{PlayerStore.playerData.isPlaying ? (
					<MdPauseCircle
						style={{ fontSize: "32px", cursor: "pointer" }}
						onClick={() => PlayerStore.changeIsPlaying()}
					/>
				) : (
					<MdPlayCircle
						style={{ fontSize: "32px", cursor: "pointer" }}
						onClick={() => PlayerStore.changeIsPlaying()}
					/>
				)}

				<MdSkipNext
					style={{ fontSize: "24px", cursor: "pointer" }}
					onClick={() => {
						PlayerStore.setSelectedTrackInCurrentPlaylist(
							undefined,
							"next",
						)
					}}
				/>
			</div>
			<div className="track-player__play-mode">
				<MdShuffle />
				<MdRepeat />
			</div>
			<div className="track-player__cover"></div>
			<div className="track-player__info">
				<div className="info-track-name">
					<p>
						{PlayerStore.playerData.selectedTrack == null
							? "----"
							: PlayerStore.playerData.selectedTrack.name}
					</p>
				</div>
				<div className="info-track-executor">
					<p>0:00</p>
				</div>
				<TrackProgressBar/>
			</div>
			<MdVolumeUp />
			<div className="track-player__volume"></div>
			{PlayerStore.playerData.selectedTrack == null ? (
				<></>
			) : (
				<ReactHowler
					src={[
						`file://${PlayerStore.playerData.selectedTrack?.path}`,
					]}
					playing={PlayerStore.playerData.isPlaying}
					volume={1.0}
					onPlayError={(id, error) => {
						console.log(error)
					}}
				/>
			)}
		</div>
	)
})

