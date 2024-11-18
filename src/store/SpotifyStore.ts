import { makeAutoObservable } from "mobx"
import { spotifyAuth } from "../api/Spotify/auth/auth"

export interface ISpotifyStore {
	accessToken: string | undefined
}

export class SpotifyStore {
	public SpotifyData: ISpotifyStore = {
		accessToken: "",
	}

	constructor() {
		makeAutoObservable(this)
        this.loadAccessToken()
	}

	public async getAccessToken() {
		if (!this.SpotifyData.accessToken) {
			try {
				const token = await spotifyAuth()
				if (token) {
					this.SpotifyData.accessToken = token
				} else {
					console.error("Не удалось получить токен")
				}
			} catch (error) {
				console.error("Ошибка при получении токена:", error)
			}
		}
	}

	private loadAccessToken() {
		const storedToken = localStorage.getItem("spotify_access_token")
		if (storedToken) {
			this.SpotifyData.accessToken = storedToken
		}
	}
}

