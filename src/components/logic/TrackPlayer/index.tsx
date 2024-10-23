import { FC, useEffect, useRef } from "react"
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
	const howlerRef = useRef<ReactHowler | null>(null)

    function formatTime(seconds: number | null): string {
        if (seconds == null) return "0:00"; // Если значение null, возвращаем "0:00"
        
        const minutes = Math.floor(seconds / 60); // Рассчитываем количество минут
        const remainingSeconds = Math.floor(seconds % 60); // Оставшиеся секунды
      
        // Форматируем оставшиеся секунды, добавляем "0", если меньше 10
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      }

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (PlayerStore.playerData.isPlaying) {
			interval = setInterval(() => {
				if (howlerRef.current) {
					PlayerStore.setCurrentSeekOfPlay(
						howlerRef.current.seek() as number,
					)
					PlayerStore.setCurrentTimeOfPlay(
						PlayerStore.playerData.currentSeekOfPlay,
					)
				}
			}, 1000)
		} else if (interval) {
			clearInterval(interval)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [PlayerStore.playerData.isPlaying])

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
					<p>
						{PlayerStore.playerData.currentTimeOfPlay == null
							? "0:00"
							: formatTime(PlayerStore.playerData.currentTimeOfPlay)}
					</p>
				</div>
				<TrackProgressBar howlerRef={howlerRef}/>
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
					ref={howlerRef}
					onEnd={() => {
						PlayerStore.changeIsPlaying()
						PlayerStore.setCurrentTimeOfPlay(0)
						PlayerStore.setSelectedTrackInCurrentPlaylist(
							undefined,
							"next",
						)
                        PlayerStore.changeIsPlaying()
					}}
				/>
			)}
		</div>
	)
})

