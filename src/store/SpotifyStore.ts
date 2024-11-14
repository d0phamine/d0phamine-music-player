import { makeAutoObservable, runInAction } from "mobx"

export interface ISpotifyStore {

}

export class SpotifyStore {
    public SpotifyData: ISpotifyStore = {

    }

    constructor(){
        makeAutoObservable(this)
    }
}