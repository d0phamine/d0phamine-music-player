import { makeAutoObservable } from "mobx"
import { spotifyAuth } from "../api/Spotify/auth/auth"
import { getUserInfo } from "../api/Spotify/getUserInfo/getUserInfo"

interface Image {
	url: string
	height: number
	width: number
}

export interface IUserInfo {
	country: string
	display_name: string
	email: string
	explicit_content: {
		filter_enabled: boolean
		filter_locked: boolean
	}
	external_urls: { spotify: string }
	followers: { href: string; total: number }
	href: string
	id: string
	images: Image[]
	product: string
	type: string
	uri: string
}

export interface ISpotifyStore {
	accessToken: string | undefined
	refreshToken: string | undefined
	userInfo: IUserInfo | null
}

export class SpotifyStore {
	public SpotifyData: ISpotifyStore = {
		accessToken: "",
		refreshToken:"",
		userInfo: null,
	}

	constructor() {
		makeAutoObservable(this)
		this.loadAccessToken()
	}

	private loadAccessToken() {
		const storedAccessToken = localStorage.getItem("spotify_access_token")
		const storedRefreshToken = localStorage.getItem("spotify_refresh_token")
		if (storedAccessToken && storedRefreshToken) {
			this.SpotifyData.accessToken = storedAccessToken
			this.SpotifyData.refreshToken = storedRefreshToken
		}
	}

	public async getAccessToken() {
		if (!this.SpotifyData.accessToken) {
			try {
				const token_data = await spotifyAuth()
				console.log(token_data)
				if (token_data) {
					this.SpotifyData.accessToken = token_data.access_token
					this.SpotifyData.refreshToken = token_data.refresh_token
				} else {
					console.error("Не удалось получить токен")
				}
			} catch (error) {
				console.error("Ошибка при получении токена:", error)
			}
		}
	}

	public async setUserInfo() {
		if (this.SpotifyData.accessToken && this.SpotifyData.refreshToken) {
			this.SpotifyData.userInfo = await getUserInfo(
				this.SpotifyData.accessToken, this.SpotifyData.refreshToken
			)
		}
	}
}

