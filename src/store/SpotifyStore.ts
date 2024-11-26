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
	NewReleases,
	CountryCodeA2,
	FeaturedPlaylists,
	Market,
	PlaylistedTrack,
} from "@spotify/web-api-ts-sdk"

export interface ISpotifyStore {
	sdk: SpotifyApi | null
	accessToken: string | undefined
	refreshToken: string | undefined
	userInfo: UserProfile | undefined
	userPlaylists: Page<SimplifiedPlaylist> | undefined
	userTopTracks: Page<Track> | undefined
	userTopArtists: Page<Artist> | undefined
	userTopCombined: Page<Track | Artist> | undefined
	userNewReleases: NewReleases | undefined
	userFeaturedPlaylists: FeaturedPlaylists | undefined
	playlistsForCategory: FeaturedPlaylists | undefined
	playlistItems: Page<PlaylistedTrack<Track>> | undefined | undefined
	playlistInfo: SimplifiedPlaylist | undefined
	forYouCategoryId: string
}

export class SpotifyStore {
	public SpotifyData: ISpotifyStore = {
		sdk: null,
		accessToken: "",
		refreshToken: "",
		userInfo: undefined,
		userPlaylists: undefined,
		userTopTracks: undefined,
		userTopArtists: undefined,
		userTopCombined: undefined,
		userNewReleases: undefined,
		userFeaturedPlaylists: undefined,
		playlistsForCategory: undefined,
		playlistItems: undefined,
		playlistInfo: undefined,
		forYouCategoryId: "0JQ5DAt0tbjZptfcdMSKl3",
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
		offset?: number,
	) {
		const [topArtists, topTracks] = await Promise.all([
			this.SpotifyData.sdk?.currentUser.topItems("artists", time_range),
			this.SpotifyData.sdk?.currentUser.topItems("tracks", time_range),
		])

		runInAction(() => {
			this.SpotifyData.userTopArtists = topArtists
			this.SpotifyData.userTopTracks = topTracks
		})
	}

	public async setUserTopCombined(
		time_range: "short_term" | "medium_term" | "long_term",
		limit: MaxInt<50>,
		offset?: number,
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

	public async setUserNewReleases(
		country?: string,
		limit?: MaxInt<50>,
		offset?: number,
	) {
		try {
			const userNewReleases =
				await this.SpotifyData.sdk?.browse.getNewReleases(
					country,
					limit,
					offset,
				)
			runInAction(() => {
				this.SpotifyData.userNewReleases = userNewReleases
			})
		} catch (error) {
			console.error("Ошибка при получении новых релизов:", error)
		}
	}

	public async setUserFeaturedPlaylists(
		country?: CountryCodeA2,
		locale?: string,
		timestamp?: string,
		limit?: MaxInt<50>,
		offset?: number,
	) {
		try {
			const userFeaturedPlaylists =
				await this.SpotifyData.sdk?.browse.getFeaturedPlaylists(
					country,
					locale,
					timestamp,
					limit,
					offset,
				)
			runInAction(() => {
				this.SpotifyData.userFeaturedPlaylists = userFeaturedPlaylists
			})
		} catch (error) {
			console.error("Ошибка при получении релизов:", error)
		}
	}

	public async setPlaylistsForCategory(
		category_id: string,
		country?: CountryCodeA2,
		limit?: MaxInt<50>,
		offset?: number,
	) {
		try {
			const playlistsForCategory =
				await this.SpotifyData.sdk?.browse.getPlaylistsForCategory(
					category_id,
					country,
					limit,
					offset,
				)
			runInAction(() => {
				this.SpotifyData.playlistsForCategory = playlistsForCategory
			})
		} catch (error) {
			console.error(
				"Ошибка при получении плейлистов по категории:",
				error,
			)
		}
	}

	public async setPlaylistItems(
		playlist_id: string,
		market?: Market,
		fields?: string,
		limit?: MaxInt<50>,
		offset?: number,
	) {
		try {
			const playlistItems =
				await this.SpotifyData.sdk?.playlists.getPlaylistItems(
					playlist_id,
					market,
					fields,
					limit,
					offset,
				)
			console.log(playlistItems)
			runInAction(() => {
				this.SpotifyData.playlistItems = playlistItems
			})
		} catch (error) {
			console.error("Ошибка при получении треков:", error)
		}
	}

	public setPlaylistInfo(info:SimplifiedPlaylist){
		this.SpotifyData.playlistInfo = info
		console.log(info)
	}
}

