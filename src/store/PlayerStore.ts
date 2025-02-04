import { makeAutoObservable, runInAction } from "mobx"

import ReactHowler from "react-howler"

export interface ITrack {
	name: string
	artist: string
	path: string
	type: string
	cover: string | undefined
	duration: number
	selected: boolean
}

export interface IPlayerStore {
	isPlaying: boolean
	isShuffled: boolean
	isLooped: boolean
	currentPlaylist: ITrack[]
	originalPlaylist: ITrack[]
	selectedTrack: ITrack | null
	currentSeekOfPlay: number | null
	currentTimeOfPlay: number | null
	playerVolume: number
	playerVolumeBuffer: number
}

type MediaSessionSeekOffset = {
	seekOffset?: number
}

type MediaSessionSeekToActionDetails = {
	seekTime: number
	fastSeek?: boolean
}

export class PlayerStore {
	public playerData: IPlayerStore = {
		isPlaying: false,
		isShuffled: false,
		isLooped: false,
		currentPlaylist: [],
		originalPlaylist: [],
		selectedTrack: null,
		currentSeekOfPlay: null,
		currentTimeOfPlay: null,
		playerVolume: 1.0,
		playerVolumeBuffer: 0,
	}

	constructor() {
		makeAutoObservable(this)
		// this.initMediaSession(ComponentStore.componentData.howlerRef);
	}

	public changeIsPlaying() {
		this.playerData.isPlaying = !this.playerData.isPlaying
	}

	public isITrack = (obj: any): obj is ITrack => {
		return (
			typeof obj.name === "string" &&
			typeof obj.path === "string" &&
			typeof obj.type === "string" &&
			(typeof obj.cover === "string" || obj.cover === null) &&
			typeof obj.duration === "number" &&
			typeof obj.selected === "boolean"
		)
	}

	public addTrackToCurrentPlaylist(track: ITrack) {
		if (
			!this.playerData.currentPlaylist.some(
				(elem) => elem.name === track.name,
			)
		) {
			this.playerData.currentPlaylist.push(track)

			const hasSelectedTrack = this.playerData.currentPlaylist.some(
				(elem) => elem.selected,
			)

			if (!hasSelectedTrack) {
				this.playerData.currentPlaylist.forEach((elem, index) => {
					elem.selected = index === 0
				})
				runInAction(() => {
					this.playerData.selectedTrack = track
					this.changeIsPlaying()
				})
			}
		}
	}

	public setSelectedTrackInCurrentPlaylist(
		track?: ITrack,
		direction?: "next" | "previous",
	) {
		if (direction) {
			const currentIndexOfSelectedTrack =
				this.playerData.currentPlaylist.findIndex(
					(track) => track.selected,
				)

			if (currentIndexOfSelectedTrack !== -1) {
				this.playerData.currentPlaylist[
					currentIndexOfSelectedTrack
				].selected = false

				let newIndex

				if (direction === "next") {
					newIndex =
						(currentIndexOfSelectedTrack + 1) %
						this.playerData.currentPlaylist.length
				} else if (direction === "previous") {
					newIndex =
						(currentIndexOfSelectedTrack -
							1 +
							this.playerData.currentPlaylist.length) %
						this.playerData.currentPlaylist.length
				}

				if (
					newIndex !== undefined &&
					newIndex >= 0 &&
					newIndex < this.playerData.currentPlaylist.length
				) {
					this.playerData.currentPlaylist[newIndex].selected = true
					this.playerData.selectedTrack =
						this.playerData.currentPlaylist[newIndex]
				}
			}
		} else {
			this.playerData.currentPlaylist.forEach((elem) => {
				elem.selected = elem === track
				if (elem === track) {
					elem.selected = true
					this.playerData.selectedTrack = elem
				}
			})
		}
	}

	public setCurrentTimeOfPlay(value: number | null) {
		this.playerData.currentTimeOfPlay = value
	}

	public setCurrentSeekOfPlay(value: number | null) {
		this.playerData.currentSeekOfPlay = value
	}

	public setPlayerVolume(value: number) {
		this.playerData.playerVolume = value
	}

	public mutePlayerVolume() {
		this.playerData.playerVolumeBuffer = this.playerData.playerVolume
		this.playerData.playerVolume = 0
	}

	public shufflePlaylist() {
		this.playerData.originalPlaylist = [...this.playerData.currentPlaylist]

		for (let i = this.playerData.currentPlaylist.length - 1; i > 0; i--) {
			const j: number = Math.floor(Math.random() * (i + 1))
			;[
				this.playerData.currentPlaylist[i],
				this.playerData.currentPlaylist[j],
			] = [
				this.playerData.currentPlaylist[j],
				this.playerData.currentPlaylist[i],
			]
		}

		this.playerData.isShuffled = true
	}

	public unShufflePlaylist() {
		this.playerData.currentPlaylist = this.playerData.originalPlaylist
		this.playerData.isShuffled = false
	}

	public changeIsLooped() {
		this.playerData.isLooped = !this.playerData.isLooped
	}

	public addArrOfTracksToCurrentPlaylist(arrOfTracks: ITrack[] | null) {
		if (arrOfTracks != null) {
			this.playerData.currentPlaylist.push(...arrOfTracks)
		}
	}

	public cleanCurrentPlaylist() {
		this.playerData.isPlaying = false
		this.playerData.currentPlaylist = []
	}

	public initMediaSession(howlerRef: React.RefObject<ReactHowler>) {
		if ("mediaSession" in navigator) {
			const updateMetadata = () => {
				const { selectedTrack } = this.playerData
				if (selectedTrack) {
					const artwork = selectedTrack.cover
						? [{ src: selectedTrack.cover }]
						: []
					navigator.mediaSession.metadata = new MediaMetadata({
						title: selectedTrack.name,
						artist: selectedTrack.artist || "",
						artwork,
					})
				}
			}

			const updatePositionState = () => {
				const duration = this.playerData.selectedTrack?.duration || 0
				const position = this.playerData.currentSeekOfPlay || 0
				if (position <= duration) {
					navigator.mediaSession.setPositionState({
						duration,
						position,
						playbackRate: 1.0,
					})
				}
			}

			const handlers = {
				play: () => this.changeIsPlaying(),
				pause: () => this.changeIsPlaying(),
				previoustrack: () =>
					this.setSelectedTrackInCurrentPlaylist(
						undefined,
						"previous",
					),
				nexttrack: () =>
					this.setSelectedTrackInCurrentPlaylist(undefined, "next"),
				seekbackward: (details: MediaSessionSeekOffset) => {
					const seekOffset = details.seekOffset || 10
					const newTime = Math.max(
						(this.playerData.currentSeekOfPlay || 0) - seekOffset,
						0,
					)
					this.setCurrentSeekOfPlay(newTime)
					this.updateHowlerSeek(newTime, howlerRef)
				},
				seekforward: (details: MediaSessionSeekOffset) => {
					const seekOffset = details.seekOffset || 10
					const newTime = Math.min(
						(this.playerData.currentSeekOfPlay || 0) + seekOffset,
						this.playerData.selectedTrack?.duration || 0,
					)
					this.setCurrentSeekOfPlay(newTime)
					this.updateHowlerSeek(newTime, howlerRef)
				},
				seekto: (details: MediaSessionSeekToActionDetails) => {
					if (
						typeof details.seekTime === "number" &&
						howlerRef.current
					) {
						const duration =
							this.playerData.selectedTrack?.duration || 0
						if (details.seekTime <= duration) {
							this.setCurrentSeekOfPlay(details.seekTime)
							this.updateHowlerSeek(details.seekTime, howlerRef)
						}
					}
				},
			}

			Object.entries(handlers).forEach(([action, handler]) => {
				navigator.mediaSession.setActionHandler(
					action as MediaSessionAction,
					handler as any,
				)
			})

			this.playerData.selectedTrack && updateMetadata()
			this.playerData.isPlaying && updatePositionState()

			runInAction(() => {
				setInterval(() => {
					if (this.playerData.isPlaying) {
						updatePositionState()
					}
				}, 1000)
			})
		}
	}

	private updateHowlerSeek(
		time: number,
		howlerRef: React.RefObject<ReactHowler>,
	) {
		const howler = howlerRef.current
		if (howler) {
			howler.seek(time)
		}
	}
}
