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
    lyricsOpen: boolean
    lyricsLoading: boolean
}

export class TextylStore {
	public textylData: ITextylStore = {
		lyrics: undefined,
        lyricsOpen: false,
        lyricsLoading: false
	}

	constructor() {
		makeAutoObservable(this)
	}

	private inputAdditionalValues(lyrics: Ilyrics[]) {
		lyrics.forEach((item: any, index: number) => {
			item.activeFlag = false
			item.id = index
		})
	}

    public changeLyricsOpen(){
        this.textylData.lyricsOpen = !this.textylData.lyricsOpen
    }

	public setLyrics(trackName: string) {
        this.textylData.lyricsLoading = true
		getLyrics(trackName).then((res) => {
            if (res) {
                this.inputAdditionalValues(res)
            }
			
			runInAction(() => {
				this.textylData.lyrics = res
			})
		})
        this.textylData.lyricsLoading = false
	}

	public setLyricsLineActive(lineId: number) {

        this.textylData.lyrics?.forEach((item: Ilyrics) => {
            item.activeFlag = false;
        });

		this.textylData.lyrics?.forEach((item: Ilyrics) => {
			if (item.id === lineId) {
				item.activeFlag = true
                if (item.id){
                    
                }
			}
		})
	}
}
