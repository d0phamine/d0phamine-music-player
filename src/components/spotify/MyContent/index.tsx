import { FC, useEffect } from "react"

import { useStores } from "store"
import { observer } from "mobx-react-lite"

import { SpotifyListItem } from "components/ui"
import { Artist, Track, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"

import "./index.scss"

export const MyContent: FC = observer(() => {
	const { SpotifyStore, ComponentStore } = useStores()

	useEffect(() => {
		SpotifyStore.setUserPlaylists()
		SpotifyStore.setUserTopCombined("long_term", 10)
	}, [])

	return (
		<div className="my-content">
			<div className="my-content__header">My Playlists</div>
			<div className="my-content__list">
				{SpotifyStore.SpotifyData.userPlaylists?.items.map(
					(item: SimplifiedPlaylist, index: number) => (
						<SpotifyListItem
							title={item.name}
							type={item.type}
							owner={item.owner.display_name}
							image={item.images[0].url}
							key={index}
							onClick={() => {
								SpotifyStore.setMediaInfo(item)
								SpotifyStore.setPlaylistItems(item.id)
								ComponentStore.changeDrawerOpen()
							}}
						/>
					),
				)}
			</div>
			<div className="my-content__header">My Top</div>
			<div className="my-content__list">
				{SpotifyStore.SpotifyData.userTopCombined?.items.map(
					(item: Track | Artist, index: number) => {
						if (item.type === "track") {
							const track = item as Track // Явное приведение к типу Track
							return (
								<SpotifyListItem
									title={track.name}
									type="Track"
									image={track.album.images[0]?.url} // У трека изображения находятся в альбоме
									key={index}
								/>
							)
						} else if (item.type === "artist") {
							const artist = item as Artist // Явное приведение к типу Artist
							return (
								<SpotifyListItem
									title={artist.name}
									type="Artist"
									image={artist.images[0]?.url} // У артиста изображения находятся в images
									key={index}
								/>
							)
						}
						return null
					},
				)}
			</div>
		</div>
	)
})
