import { makeAutoObservable, runInAction } from "mobx"
import { getLyrics } from "api/genius"

export interface IGeniusStore {
	lyrics: any
}

export class GeniusStore {
	public lyricsData: IGeniusStore = {
		lyrics: "",
	}

	constructor() {
		makeAutoObservable(this)
	}

	public setLyrics(trackName: string) {
		getLyrics(trackName).then((res) => {
			runInAction(() => {
				this.lyricsData.lyrics = res
			})
		})
	}
}
