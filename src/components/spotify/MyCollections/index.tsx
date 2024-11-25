import { FC, useEffect } from "react"

import { useStores } from "../../../store"
import { observer } from "mobx-react-lite"

import { PlaylistCard } from "../PlaylistCard"
import { SimplifiedAlbum } from "@spotify/web-api-ts-sdk"

import "./index.scss"


export const MyCollections: FC = observer(() => {
	const { SpotifyStore } = useStores()

	useEffect(() => {
		SpotifyStore.setUserFeaturedPlaylists("US", "en-US")
		SpotifyStore.setUserNewReleases("US")
	}, [])

	return (
		<div className="my-collections">
			<div className="my-collections__new-releases">
				<h2>New releases</h2>
				<div className="new-releases-container">
					{SpotifyStore.SpotifyData.userNewReleases?.albums.items.map(
                        (item:SimplifiedAlbum, index:number) => (
                            <PlaylistCard type="album" title={item.name} artists={item.artists} cover={item.images[0].url} />
                        )
                    )}
				</div>
			</div>
			<div className="my-collectrions__featured-playlists"></div>
		</div>
	)
})

