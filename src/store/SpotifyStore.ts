import { makeAutoObservable, runInAction } from "mobx"
import {
	SpotifyApi,
	SdkOptions,
	AuthorizationCodeWithPKCEStrategy,
	UserProfile,
	SimplifiedPlaylist,
	Page,
	Artist,
	Track,
	MaxInt,
} from "@spotify/web-api-ts-sdk"

export interface ISpotifyStore {
	accessToken: string | undefined
	refreshToken: string | undefined
	userInfo: UserProfile | undefined
	userPlaylists: Page<SimplifiedPlaylist> | undefined
	userTopTracks: Page<Track> | undefined
	userTopArtists: Page<Artist> | undefined
	userTopCombined: Page<Track | Artist> | undefined
	sdk: SpotifyApi | null
}

export class SpotifyStore {
	public SpotifyData: ISpotifyStore = {
		accessToken: "",
		refreshToken: "",
		userInfo: undefined,
		userPlaylists: undefined,
		userTopTracks: undefined,
		userTopArtists: undefined,
		userTopCombined: undefined,
		sdk: null,
	}

	constructor() {
		makeAutoObservable(this)
	}

	public async initSdk(
		clientId: string,
		redirectUrl: string,
		scopes: string[],
		config?: SdkOptions,
	) {
		const auth = new AuthorizationCodeWithPKCEStrategy(
			clientId,
			redirectUrl,
			scopes,
		)
		const internalSdk = new SpotifyApi(auth, config)

		try {
			const { authenticated } = await internalSdk.authenticate()

			if (authenticated) {
				runInAction(() => {
					this.SpotifyData.sdk = internalSdk
				})
			}
		} catch (e: Error | unknown) {
			const error = e as Error
			if (
				error &&
				error.message &&
				error.message.includes("No verifier found in cache")
			) {
				console.error(
					"If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
					error,
				)
			} else {
				console.error(e)
			}
		}
	}

	public async setUserInfo() {
		const userInfo = await this.SpotifyData.sdk?.currentUser.profile()
		runInAction(() => {
			this.SpotifyData.userInfo = userInfo
		})
	}

	public async setUserPlaylists() {
		const userPlaylist =
			await this.SpotifyData.sdk?.currentUser.playlists.playlists()
		runInAction(() => {
			this.SpotifyData.userPlaylists = userPlaylist
		})
	}

	public async setUserTop(
		time_range: "short_term" | "medium_term" | "long_term",
		limit?: MaxInt<50>,
		offset?: MaxInt<50>,
	) {
		const [topArtists, topTracks] = await Promise.all([
			this.SpotifyData.sdk?.currentUser.topItems("artists", time_range),
			this.SpotifyData.sdk?.currentUser.topItems("tracks", time_range),
		])

		// Сохраняем данные в стор
		runInAction(() => {
			this.SpotifyData.userTopArtists = topArtists
			this.SpotifyData.userTopTracks = topTracks
		})
	}

	public async setUserTopCombined(
		time_range: "short_term" | "medium_term" | "long_term",
		limit: MaxInt<50>,
		offset?: MaxInt<50>,
	) {
		try {
			const [topArtists, topTracks] = await Promise.all([
				this.SpotifyData.sdk?.currentUser.topItems(
					"artists",
					time_range,
					limit,
				),
				this.SpotifyData.sdk?.currentUser.topItems(
					"tracks",
					time_range,
					limit,
				),
			])

			const combined: Page<Track | Artist> = {
				href: "", // Объединенный href не имеет смысла, но можно оставить пустым или с описанием
				items: [
					...(topArtists?.items || []), // Артисты
					...(topTracks?.items || []), // Треки
				],
				limit: limit,
				offset: offset || 0,
				total: (topArtists?.total || 0) + (topTracks?.total || 0),
				next: null, // Логика для "next" сложнее; задайте null или определите сами
				previous: null, // Аналогично с previous
			}

			runInAction(() => {
				this.SpotifyData.userTopCombined = combined
			})
		} catch (error) {
			console.error("Failed to fetch combined top items:", error)
		}
	}
}

