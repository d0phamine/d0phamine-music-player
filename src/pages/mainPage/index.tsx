import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"


import { MainLayout } from "../../Layout/mainLayout"

import { useStores } from "../../store"
import { FileBrowser, TrackPlayer, FavoriteBrowser } from "../../components"

import "./index.scss"

import { CurrentPlaylist } from "../../components"

export const IndexPage: FC = observer(() => {
	const { FSstore } = useStores()

	useEffect(() => {
		FSstore.setBrowserDirs()
		FSstore.getFavoriteDirs()
	}, [FSstore])
	return (
		<MainLayout>
			<div className="main-page">
				<div className="main-page__browser">
					<FavoriteBrowser />
					<FileBrowser />
				</div>
				<div className="main-page__player">
					<TrackPlayer />
					<CurrentPlaylist />
				</div>
			</div>
		</MainLayout>
	)
})

