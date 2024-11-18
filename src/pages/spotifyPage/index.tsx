import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { MainLayout } from "../../Layout/mainLayout"

import { useStores } from "../../store"

import "./index.scss"

export const SpotifyPage = observer(() => {
	const { SpotifyStore } = useStores()

	return (
		<MainLayout>
			<div className="spotify-page">
				<div className="spotify-page__browser">
				</div>
				<div className="spotify-page__player"></div>
			</div>
		</MainLayout>
	)
})
