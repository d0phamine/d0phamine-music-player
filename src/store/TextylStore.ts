import { makeAutoObservable, runInAction } from "mobx"
import { getLyrics } from "api/textyl"

export interface ITextylStore {
    lyrics: [{ seconds: number, lyrics: string }] | undefined
}

export class TextylStore {
    public textylData: ITextylStore = {
        lyrics: undefined
    }

    constructor() {
        makeAutoObservable(this)
    }

    public setLyrics(trackName: string) {
        getLyrics(trackName).then((res) => {
            runInAction(() => {
                this.textylData.lyrics = res
            })
        })
    }
}