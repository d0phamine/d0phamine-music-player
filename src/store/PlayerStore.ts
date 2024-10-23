import { makeAutoObservable, runInAction } from "mobx"
import ReactHowler from "react-howler"

export interface ITrack {
	name: string
	path: string
	type: string
	cover: string | null
	duration: number
	selected: boolean
}

export interface IPlayerStore {
	isPlaying: boolean
	currentPlaylist: ITrack[]
	selectedTrack: ITrack | null
	currentSeekOfPlay: number | null
    currentTimeOfPlay: number | null
}

export class PlayerStore {
	public playerData: IPlayerStore = {
		isPlaying: false,
		currentPlaylist: [],
		selectedTrack: null,
		currentSeekOfPlay: null,
        currentTimeOfPlay: null,
	}

	constructor() {
		makeAutoObservable(this)
	}

	public changeIsPlaying() {
		this.playerData.isPlaying
			? (this.playerData.isPlaying = false)
			: (this.playerData.isPlaying = true)
	}

	public setSelectedTrack(selectedTrack: ITrack) {
		this.playerData.selectedTrack = selectedTrack
		console.log(this.playerData.selectedTrack)
	}

	public addTrackToCurrentPlaylist(track: ITrack) {
		if (!this.playerData.currentPlaylist.includes(track)) {
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
					this.setSelectedTrack(track)
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

    public setCurrentTimeOfPlay(value:number | null){
        this.playerData.currentTimeOfPlay = value
    }

    public setCurrentSeekOfPlay(value:number | null){
        this.playerData.currentSeekOfPlay = value
    }
}

