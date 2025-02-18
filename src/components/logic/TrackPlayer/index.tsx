import { FC, useEffect, useRef, useState } from "react"

import { observer } from "mobx-react-lite"

import Marquee from "react-fast-marquee"
import ReactHowler from "react-howler"
import { AiOutlineExpandAlt } from "react-icons/ai"
import { MdRepeat, MdShuffle, MdVolumeMute, MdVolumeUp } from "react-icons/md"

import { useStores } from "store"

import { PlayerControls, TrackProgressBar, VolumeChanger } from "components/ui"

import "./index.scss"

export const TrackPlayer: FC = observer(() => {
	const { PlayerStore, ComponentStore, TextylStore } = useStores()
	const howlerRef = useRef<ReactHowler | null>(null)
	const coverImage = useRef<HTMLImageElement>(null)
	const infoTrackNameRef = useRef<HTMLDivElement>(null)
	const [isOverflow, setIsOverflow] = useState(false)
	const [isPlayingTrackName, setIsPlayingTrackName] = useState(true)

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
		PlayerStore.initMediaSession(howlerRef)
	}, [])

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;
	
		const updateSeek = () => {
			if (howlerRef.current) {
				const seek = howlerRef.current.seek();
				if (typeof seek === "number") {
					PlayerStore.setCurrentSeekOfPlay(seek);
					PlayerStore.setCurrentTimeOfPlay(seek);
				}
			}
		};
	
		if (PlayerStore.playerData.isPlaying) {
			intervalId = setInterval(updateSeek, 200); // обновляем каждую секунду
		} else if (intervalId !== null) {
			clearInterval(intervalId);
		}
	
		return () => {
			if (intervalId !== null) {
				clearInterval(intervalId);
			}
		};
	}, [PlayerStore.playerData.isPlaying]);

	useEffect(() => {
		ComponentStore.setHowlerRef(howlerRef)
		if (howlerRef.current) {
			howlerRef.current.seek(0)
			PlayerStore.setCurrentSeekOfPlay(0)
			PlayerStore.setCurrentTimeOfPlay(0)
		}

		if (PlayerStore.playerData.selectedTrack != null) {
			let trackName = PlayerStore.playerData.selectedTrack?.artist
				? `${PlayerStore.playerData.selectedTrack.artist} - ${PlayerStore.playerData.selectedTrack.name}`
				: PlayerStore.playerData.selectedTrack?.name || ""
			TextylStore.setLyrics(trackName)
		}

		const imageElement = coverImage.current
		const handleLoad = () => {
			if (imageElement && imageElement.src) {
				ComponentStore.setBigPlayerCoverMainColor(imageElement)
			} else {
				ComponentStore.setBigPlayerCoverMainColor(null)
			}
		}
		if (imageElement) {
			imageElement.addEventListener("load", handleLoad)
			// Call handleLoad immediately in case the image is already loaded
			if (imageElement.complete || !imageElement.src) {
				handleLoad()
			}
		}

		if (infoTrackNameRef.current) {
			setIsOverflow(
				infoTrackNameRef.current.scrollWidth >
					infoTrackNameRef.current.clientWidth,
			)
		}

		return () => {
			if (imageElement) {
				imageElement.removeEventListener("load", handleLoad)
			}
		}
	}, [PlayerStore.playerData.selectedTrack])

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
						ref={coverImage}
					/>
				)}
				<AiOutlineExpandAlt
					style={{ fontSize: "36px", color: "#fff" }}
				/>
			</div>
			<div className="track-player__info">
				<div className="info-track-name" ref={infoTrackNameRef}>
					{isOverflow ? (
						<Marquee
							pauseOnHover={true}
							gradient={false}
							speed={20}
							autoFill={false}
							play={isPlayingTrackName}
							onCycleComplete={() => {
								setIsPlayingTrackName(false)
								setTimeout(
									() => setIsPlayingTrackName(true),
									3000,
								)
							}}
						>
							{PlayerStore.playerData.selectedTrack == null
								? "---- "
								: `${PlayerStore.playerData.selectedTrack.artist}`
									? `${PlayerStore.playerData.selectedTrack.artist} - ${PlayerStore.playerData.selectedTrack.name} `
									: `${PlayerStore.playerData.selectedTrack.name}`}
						</Marquee>
					) : (
						<p>
							{PlayerStore.playerData.selectedTrack == null
								? "---- "
								: `${PlayerStore.playerData.selectedTrack.artist}`
									? `${PlayerStore.playerData.selectedTrack.artist} - ${PlayerStore.playerData.selectedTrack.name} `
									: `${PlayerStore.playerData.selectedTrack.name}`}
						</p>
					)}
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
