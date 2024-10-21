import { makeAutoObservable, runInAction } from "mobx"

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
}

export class PlayerStore {
	public playerData: IPlayerStore = {
		isPlaying: false,
		currentPlaylist: [],
		selectedTrack: null,
	}

	constructor() {
		makeAutoObservable(this)
	}

	public changeIsPlaying() {
		this.playerData.isPlaying
			? (this.playerData.isPlaying = false)
			: (this.playerData.isPlaying = true)
	}

	public getSelectedTrack(selectedTrack: ITrack) {
		this.playerData.selectedTrack = selectedTrack
		console.log(this.playerData.selectedTrack)
	}

	public addTrackToCurrentPlaylist(track: ITrack) {
		if (!this.playerData.currentPlaylist.includes(track)) {
            this.playerData.currentPlaylist.push(track);
    
            // Проверяем, есть ли трек с selected: true
            const hasSelectedTrack = this.playerData.currentPlaylist.some(elem => elem.selected);
    
            // Если нет выбранного трека, назначаем первый трек как selected
            if (!hasSelectedTrack) {
                this.playerData.currentPlaylist.forEach((elem, index) => {
                    elem.selected = index === 0; // Первый элемент получает true, остальные false
                });
            }
        }
	}

	public setSelectedTrackInCurrentPlaylist(track: ITrack) {
		this.playerData.currentPlaylist.forEach((elem) => {
			elem.selected = elem === track // Если трек совпадает с выбранным, установить selected в true, иначе false
		})
	}
}

