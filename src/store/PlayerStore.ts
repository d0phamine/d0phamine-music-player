import { makeAutoObservable, runInAction } from "mobx"

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
	}

	public changeIsPlaying() {
		this.playerData.isPlaying
			? (this.playerData.isPlaying = false)
			: (this.playerData.isPlaying = true)
	}

	// public setSelectedTrack(selectedTrack: ITrack) {
	// 	this.playerData.selectedTrack = selectedTrack
	// 	console.log(this.playerData.selectedTrack)
	// }

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

			// Проверяем, есть ли трек с selected: true
			const hasSelectedTrack = this.playerData.currentPlaylist.some(
				(elem) => elem.selected,
			)

			// Если нет выбранного трека, назначаем первый трек как selected
			if (!hasSelectedTrack) {
				this.playerData.currentPlaylist.forEach((elem, index) => {
					elem.selected = index === 0 // Первый элемент получает true, остальные false
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
				// Сбрасываем selected для текущего трека
				this.playerData.currentPlaylist[
					currentIndexOfSelectedTrack
				].selected = false

				let newIndex

				if (direction === "next") {
					// Переход вперед
					newIndex =
						(currentIndexOfSelectedTrack + 1) %
						this.playerData.currentPlaylist.length
				} else if (direction === "previous") {
					// Переход назад с зацикливанием
					newIndex =
						(currentIndexOfSelectedTrack -
							1 +
							this.playerData.currentPlaylist.length) %
						this.playerData.currentPlaylist.length
				}

				// Устанавливаем selected для нового трека
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
				elem.selected = elem === track // Если трек совпадает с выбранным, установить selected в true, иначе false
				if (elem === track) {
					elem.selected = true
					this.playerData.selectedTrack = elem
					console.log(this.playerData.selectedTrack)
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

			// Меняем местами элементы в массиве
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
		this.playerData.isLooped
			? (this.playerData.isLooped = false)
			: (this.playerData.isLooped = true)
	}

	public addArrOfTracksToCurrentPlaylist(arrOfTracks: ITrack[] | null) {
		if (arrOfTracks != null) {
			this.playerData.currentPlaylist.push(...arrOfTracks)
		}
	}
}

