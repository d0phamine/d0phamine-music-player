import { makeAutoObservable, runInAction } from "mobx"
import { getLyrics } from "api/textyl"

export interface Ilyrics {
	seconds: number
	lyrics: string
	activeFlag: boolean
	id: number
}

export interface ITextylStore {
	lyrics: Ilyrics[] | undefined
	lyricsAppear: boolean
	lyricsLoading: boolean
}

export class TextylStore {
	public textylData: ITextylStore = {
		lyrics: undefined,
		lyricsAppear: false,
		lyricsLoading: false,
	}

	constructor() {
		makeAutoObservable(this)
	}

	private inputAdditionalValues(lyrics: Ilyrics[]) {
		const loadingElement: Ilyrics = {
			seconds: 0,
			lyrics: "loading",
			activeFlag: true,
			id: 1,
		}
		lyrics.unshift(loadingElement)
		lyrics.forEach((item: any, index: number) => {
			if (item.lyrics === "loading") {
				item.activeFlag = true
				item.id = index
			} else {
				item.activeFlag = false
				item.id = index
			}
		})
	}

	public changeLyricsAppear() {
		this.textylData.lyricsAppear = !this.textylData.lyricsAppear
	}

	public setLyrics(trackName: string) {
		this.textylData.lyricsLoading = true
		getLyrics(trackName).then((res) => {
			if (res) {
				this.inputAdditionalValues(res)
			}
			runInAction(() => {
				this.textylData.lyrics = res
				this.textylData.lyricsLoading = false
			})
		})
	}

	public setLyricsLineActive(lineId: number) {
		this.textylData.lyrics?.forEach((item: Ilyrics) => {
			item.activeFlag = false
		})

		this.textylData.lyrics?.forEach((item: Ilyrics) => {
			if (item.id === lineId) {
				item.activeFlag = true
			}
		})
	}
}

