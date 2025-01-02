import { FC, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import ReactHowler from "react-howler"
import { MdShuffle, MdRepeat, MdVolumeUp, MdVolumeMute } from "react-icons/md"
import { useStores } from "../../../store"
import { TrackProgressBar, VolumeChanger, PlayerControls } from "../../ui"
import "./index.scss"

export const TrackPlayer: FC = observer(() => {
	const { PlayerStore, ComponentStore } = useStores()
	const howlerRef = useRef<ReactHowler | null>(null)

	const formatTime = (seconds: number | null) => {
		if (seconds == null) return "0:00" // Если значение null, возвращаем "0:00"

		const minutes = Math.floor(seconds / 60) // Рассчитываем количество минут
		const remainingSeconds = Math.floor(seconds % 60) // Оставшиеся секунды

		// Форматируем оставшиеся секунды, добавляем "0", если меньше 10
		return `${minutes}:${
			remainingSeconds < 10 ? "0" : ""
		}${remainingSeconds}`
	}

	useEffect(() => {
		ComponentStore.setHowlerRef(howlerRef)
		let animationFrameId: number = 0

		const updateSeek = () => {
			if (howlerRef.current) {
				const seek = howlerRef.current.seek()
				if (typeof seek === "number") {
					PlayerStore.setCurrentSeekOfPlay(seek)
					PlayerStore.setCurrentTimeOfPlay(seek)
				}
			}
			animationFrameId = requestAnimationFrame(updateSeek)
		}

		if (PlayerStore.playerData.isPlaying) {
			animationFrameId = requestAnimationFrame(updateSeek)
		} else {
			cancelAnimationFrame(animationFrameId)
		}

		return () => {
			cancelAnimationFrame(animationFrameId)
		}
	}, [PlayerStore.playerData.isPlaying])

	useEffect(() => {
		if (howlerRef.current) {
			howlerRef.current.seek(0)
			PlayerStore.setCurrentSeekOfPlay(0)
			PlayerStore.setCurrentTimeOfPlay(0)
		}
	}, [PlayerStore.playerData.selectedTrack])

	useEffect(() => {
		if ("mediaSession" in navigator) {
			const { selectedTrack } = PlayerStore.playerData

			if (selectedTrack) {
				const artwork = selectedTrack.cover
					? [
							{
								src: selectedTrack.cover,
							},
					  ]
					: []

				navigator.mediaSession.metadata = new MediaMetadata({
					title: selectedTrack.name,
					artist: selectedTrack.artist || "",
					artwork: artwork,
				})
			}

			navigator.mediaSession.setActionHandler("play", () => {
				PlayerStore.changeIsPlaying()
			})

			navigator.mediaSession.setActionHandler("pause", () => {
				PlayerStore.changeIsPlaying()
			})

			navigator.mediaSession.setActionHandler("previoustrack", () => {
				PlayerStore.setSelectedTrackInCurrentPlaylist(
					undefined,
					"previous",
				)
			})

			navigator.mediaSession.setActionHandler("nexttrack", () => {
				PlayerStore.setSelectedTrackInCurrentPlaylist(undefined, "next")
			})

			navigator.mediaSession.setActionHandler(
				"seekbackward",
				(details) => {
					const seekOffset = details.seekOffset || 10 // Default to 10 seconds if not provided
					if (PlayerStore.playerData.currentSeekOfPlay) {
						const newTime = Math.max(
							PlayerStore.playerData.currentSeekOfPlay -
								seekOffset,
							0,
						)
						howlerRef.current?.seek(newTime)
						PlayerStore.setCurrentSeekOfPlay(newTime)
					}
				},
			)

			navigator.mediaSession.setActionHandler(
				"seekforward",
				(details) => {
					const seekOffset = details.seekOffset || 10
					if (PlayerStore.playerData.currentSeekOfPlay) {
						const newTime = Math.min(
							PlayerStore.playerData.currentSeekOfPlay +
								seekOffset,
							howlerRef.current?.duration() || 0,
						)
						howlerRef.current?.seek(newTime)
						PlayerStore.setCurrentSeekOfPlay(newTime)
					}
				},
			)

			navigator.mediaSession.setActionHandler("seekto", (details) => {
				const howler = howlerRef.current as unknown as {
					fastSeek?: (time: number) => void
					seek: (time: number) => void
				}
				if (details.fastSeek && howler.fastSeek && details.seekTime) {
					howler.fastSeek(details.seekTime)
				} else if (howler.seek && details.seekTime) {
					howler.seek(details.seekTime)
				}

				if (details.seekTime) {
					PlayerStore.setCurrentSeekOfPlay(details.seekTime)
				}
			})
		}
	}, [PlayerStore.playerData.isPlaying])

	return (
		<div className="track-player">
			<div className="track-player__controls">
				<PlayerControls />
			</div>
			<div className="track-player__play-mode">
				<MdShuffle
					style={
						PlayerStore.playerData.isShuffled
							? { cursor: "pointer", color: "#6f56d0" }
							: { cursor: "pointer" }
					}
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
				<MdRepeat
					style={
						PlayerStore.playerData.isLooped
							? { cursor: "pointer", color: "#6f56d0" }
							: { cursor: "pointer" }
					}
					onClick={() => PlayerStore.changeIsLooped()}
				/>
			</div>
			<div
				className="track-player__cover"
				style={{ backgroundColor: "#cccccc" }}
				onClick={
					PlayerStore.playerData.selectedTrack == null
						? () => null
						: () => ComponentStore.changeBigPlayerOpen()
				}
			>
				{PlayerStore.playerData.selectedTrack == null ? null : (
					<img
						src={PlayerStore.playerData.selectedTrack.cover}
						alt=""
					/>
				)}
			</div>
			<div className="track-player__info">
				<div className="info-track-name">
					<p>
						{PlayerStore.playerData.selectedTrack == null
							? "----"
							: PlayerStore.playerData.selectedTrack.artist
							? `${PlayerStore.playerData.selectedTrack.artist} - ${PlayerStore.playerData.selectedTrack.name}`
							: PlayerStore.playerData.selectedTrack.name}
					</p>
				</div>
				<div className="info-track-executor">
					<p>
						{formatTime(PlayerStore.playerData.currentTimeOfPlay)}
					</p>
				</div>
				<TrackProgressBar howlerRef={howlerRef} />
			</div>
			{PlayerStore.playerData.playerVolume ? (
				<MdVolumeUp
					onClick={() => PlayerStore.mutePlayerVolume()}
					style={{ cursor: "pointer" }}
				/>
			) : (
				<MdVolumeMute
					onClick={() =>
						PlayerStore.setPlayerVolume(
							PlayerStore.playerData.playerVolumeBuffer,
						)
					}
					style={{ cursor: "pointer" }}
				/>
			)}
			<VolumeChanger />
			{PlayerStore.playerData.selectedTrack == null ? (
				<></>
			) : (
				<ReactHowler
					src={[
						`file://${PlayerStore.playerData.selectedTrack?.path}`,
					]}
					playing={PlayerStore.playerData.isPlaying}
					volume={PlayerStore.playerData.playerVolume}
					ref={howlerRef}
					onEnd={() => {
						PlayerStore.changeIsPlaying()
						PlayerStore.setCurrentTimeOfPlay(0)
						if (!PlayerStore.playerData.isLooped) {
							PlayerStore.setSelectedTrackInCurrentPlaylist(
								undefined,
								"next",
							)
						}
						PlayerStore.changeIsPlaying()
					}}
					html5={true}
				/>
			)}
		</div>
	)
})

