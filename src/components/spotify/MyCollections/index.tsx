import { FC, useEffect, useRef } from "react"

import { useStores } from "../../../store"
import { observer } from "mobx-react-lite"

import { PlaylistCard } from "../../ui"
import { PlaylistDrawer } from "../../logic"
import { SimplifiedAlbum, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"

import "./index.scss"

export const MyCollections: FC = observer(() => {
	const { SpotifyStore, ComponentStore } = useStores()
    const containerRef = useRef<HTMLDivElement | null>(null)

    const updateContainerSize = () => {
		if (containerRef.current) {
			ComponentStore.setDrawerContainerRefSize(containerRef)
		}
	}

    useEffect(() => {
		window.addEventListener("resize", updateContainerSize)
		return () => {
			window.removeEventListener("resize", updateContainerSize)
		}
	}, [])

	useEffect(() => {
        updateContainerSize()
		SpotifyStore.setUserNewReleases()
        
	}, [])

	return (
		<div className="my-collections" ref={containerRef}>
			<div className="my-collections__new-releases">
				<h2>New releases</h2>
				<div className="new-releases-container">
					{SpotifyStore.SpotifyData.userNewReleases?.albums.items.map(
						(item: SimplifiedAlbum, index: number) => (
							<PlaylistCard
								type="album"
								title={item.name}
								artists={item.artists}
								cover={item.images[0].url}
								key={index}
                                onClick={() => {
                                    SpotifyStore.setMediaInfo(item)
                                    SpotifyStore.setAlbumItems(item.id)
                                    ComponentStore.changeDrawerOpen()
                                }}
							/>
						),
					)}
				</div>
			</div>
			{/* <div className="my-collections__featured-playlists">
				<h2>Featured playlists</h2>
				<div className="featured-playlists-container">
					{SpotifyStore.SpotifyData.userFeaturedPlaylists?.playlists.items.map(
						(item: SimplifiedPlaylist, index: number) => (
							<PlaylistCard
								type="playlist"
								title={item.name}
								cover={item.images[0].url}
								key={index}
                                onClick={() => {
                                    SpotifyStore.setPlaylistInfo(item)
									SpotifyStore.setPlaylistItems(item.id)
									ComponentStore.changeDrawerOpen()
								}}
							/>
						),
					)}
				</div>
			</div>
			<div className="my-collections__for-you-playlists">
				<h2>For You</h2>
				<div className="for-you-playlists-container">
					{SpotifyStore.SpotifyData.playlistsForCategory?.playlists.items.map(
						(item: SimplifiedPlaylist, index: number) => (
							<PlaylistCard
								type="playlist"
								title={item.description}
								cover={item.images[0].url}
								key={index}
                                onClick={() => {
                                    SpotifyStore.setPlaylistInfo(item)
									SpotifyStore.setPlaylistItems(item.id)
									ComponentStore.changeDrawerOpen()
								}}
							/>
						),
					)}
				</div>
			</div> */}
			<PlaylistDrawer
				style={{
					height: ComponentStore.componentData.containerRefSize
						.height,
				}}
			/>
		</div>
	)
})

