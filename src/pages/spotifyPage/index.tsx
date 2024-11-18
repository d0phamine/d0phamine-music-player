import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { MainLayout } from "../../Layout/mainLayout"

import { useStores } from "../../store"

import "./index.scss"

export const SpotifyPage: FC = observer(() => {
	const { SpotifyStore } = useStores()

	useEffect(() => {
		SpotifyStore.setUserInfo()
	}, [SpotifyStore])

	return (
		<MainLayout>
			<div className="spotify-page">
				<div className="spotify-page__browser"></div>
				<div className="spotify-page__player"></div>
			</div>
		</MainLayout>
	)
})

