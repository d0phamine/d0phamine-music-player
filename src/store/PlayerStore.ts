import { makeAutoObservable, runInAction } from "mobx"

export interface ITrack {
	name: string
	path: string
	type: string
    cover: string | null
    duration: number
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
	}

	public addTrackToCurrentPlaylist(track: ITrack) {
		if (!this.playerData.currentPlaylist.includes(track)) {
			this.playerData.currentPlaylist.unshift(track)
		}
	}
}

