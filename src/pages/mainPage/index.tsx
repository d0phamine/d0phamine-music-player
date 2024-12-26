import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"


import { MainLayout } from "../../Layout/mainLayout"

import { useStores } from "../../store"
import { FileBrowser, TrackPlayer, FavoriteBrowser, BigPlayer } from "../../components"

import "./index.scss"

import { CurrentPlaylist } from "../../components"

export const MainPage: FC = observer(() => {
	const { FSstore, ThemeStore } = useStores()

	useEffect(() => {
		FSstore.setBrowserDirs()
		FSstore.getFavoriteDirs()
	}, [FSstore])
	return (
		<MainLayout>
			<div className="main-page">
				<div className="main-page__browser" style={{borderColor:ThemeStore.CurrentTheme.borderColor}}>
					<FavoriteBrowser />
					<FileBrowser />
				</div>
				<div className="main-page__player" style={{borderColor:ThemeStore.CurrentTheme.borderColor}}>
					<TrackPlayer />
					<CurrentPlaylist />
					<BigPlayer />
				</div>
			</div>
		</MainLayout>
	)
})

