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
	Categories,
	SimplifiedArtist,
	Image,
	ExternalUrls,
	Followers,
	UserReference,
	TrackReference,
	SimplifiedTrack,
} from "@spotify/web-api-ts-sdk"

export interface SimplifiedMedia {
	id: string
	name: string
	uri: string
	images: Image[]
	external_urls: ExternalUrls
	type: "album" | "playlist" | string // Тип медиа

	// Уникальные для альбомов
	album_type?: string
	album_group?: string
	artists?: SimplifiedArtist[]
	release_date?: string
	total_tracks?: number

	// Уникальные для плейлистов
	collaborative?: boolean
	description?: string
	followers?: Followers
	owner?: UserReference
	public?: boolean
	tracks?: TrackReference | null
}

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
	userCategories: Categories | undefined
	playlistsForCategory: FeaturedPlaylists | undefined
	playlistItems: Page<PlaylistedTrack<Track>> | undefined
	albumItems: Page<SimplifiedTrack> | undefined
	mediaInfo: SimplifiedMedia | undefined
	mediaLoading: boolean
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
		userCategories: undefined,
		playlistsForCategory: undefined,
		playlistItems: undefined,
		albumItems: undefined,
		mediaInfo: undefined,
		mediaLoading: false,
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

	/**
	 * 
	 * @Deprecated
	 * 
	 * public async setUserFeaturedPlaylists(
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
	 * 
	 */

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

			runInAction(() => {
				if (playlistItems?.items) {
					if (offset === undefined) {
						// Если offset не передан, заменяем весь список
						this.SpotifyData.playlistItems = playlistItems
					} else {
						// Если offset передан, добавляем новые элементы к уже существующему массиву
						this.SpotifyData.playlistItems?.items.push(
							...playlistItems.items,
						)
					}
				}
			})
		} catch (error) {
			console.error("Ошибка при получении треков из плейлиста", error)
		}
	}

	public async clearPlaylistItems() {
		this.SpotifyData.playlistItems = undefined
	}

	public async setAlbumItems(
		albumId: string,
		market?: Market,
		limit?: MaxInt<50>,
		offset?: number,
	) {
		try {
			// Выполняем запрос на получение треков из альбома
			const albumItems = await this.SpotifyData.sdk?.albums.tracks(
				albumId,
				market,
				limit,
				offset,
			)

			runInAction(() => {
				if (albumItems?.items) {
					if (offset === undefined) {
						// Если offset не передан (первая загрузка), заменяем весь список
						this.SpotifyData.albumItems = albumItems
					} else {
						// Если offset передан (добавляем новые элементы)
						this.SpotifyData.albumItems?.items.push(
							...albumItems.items,
						)
					}
				}
			})
		} catch (error) {
			console.error("Ошибка при получении треков из альбома", error)
		}
	}

	public async setUserCategories(
		country?: CountryCodeA2,
		locale?: string,
		limit?: MaxInt<50>,
		offset?: number,
	) {
		try {
			const userCategories =
				await this.SpotifyData.sdk?.browse.getCategories(
					country,
					locale,
					limit,
					offset,
				)
			runInAction(() => {
				this.SpotifyData.userCategories = userCategories
			})
		} catch (error) {
			console.error("Ошибка получения категорий", error)
		}
	}

	public setMediaInfo(info: SimplifiedMedia) {
		this.SpotifyData.mediaInfo = info
	}
}

