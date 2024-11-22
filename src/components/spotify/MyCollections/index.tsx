import { FC, useEffect, useState } from "react"

import { useStores } from "../../../store"
import { observer } from "mobx-react-lite"

import "./index.scss"

export const MyCollections: FC = observer(() => {
	const { SpotifyStore } = useStores()

	useEffect(() => {
		SpotifyStore.setUserFeaturedPlaylists('RU', 'en-US')
	}, [])

	return <div className="my-collections"></div>
})

