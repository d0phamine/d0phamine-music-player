import { makeAutoObservable, runInAction } from "mobx"
import { spotifyAuth } from "../api/Spotify/auth/auth"
import { getUserInfo, getUserPlaylists } from "../api/Spotify/getData"

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
	userPlaylists:{}
}

export class SpotifyStore {
	public SpotifyData: ISpotifyStore = {
		accessToken: "",
		refreshToken:"",
		userInfo: null,
		userPlaylists:{}
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
		// Проверяем, есть ли уже accessToken
		if (!this.SpotifyData.accessToken) {
		  try {
			// Получаем токены через функцию spotifyAuth
			const token_data = await spotifyAuth();
	  
			// Если данные о токенах получены, обновляем хранилище
			if (token_data) {
			  this.SpotifyData.accessToken = token_data.access_token;
			  this.SpotifyData.refreshToken = token_data.refresh_token;
			} else {
			  console.error("Не удалось получить токен");
			}
		  } catch (error) {
			console.error("Ошибка при получении токена:", error);
		  }
		}
	  }

	public setTokens(access_token:string, refresh_token:string){
		runInAction(() => {
			this.SpotifyData.accessToken = access_token
			this.SpotifyData.refreshToken = refresh_token
		})
	}

	public async setUserInfo() {
		if (this.SpotifyData.accessToken && this.SpotifyData.refreshToken) {
			this.SpotifyData.userInfo = await getUserInfo(
				this.SpotifyData.accessToken, this.SpotifyData.refreshToken
			)
		}
	}

	public async setUserPlaylists() {
		if (this.SpotifyData.accessToken && this.SpotifyData.refreshToken) {
			this.SpotifyData.userPlaylists = await getUserPlaylists(
				this.SpotifyData.accessToken, this.SpotifyData.refreshToken, {offset:5, limit:20}
			)
		}
	}
}

