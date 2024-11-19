import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Scopes } from "@spotify/web-api-ts-sdk"

import { MainLayout } from "../../Layout/mainLayout"

import { useStores } from "../../store"

import "./index.scss"
import { MyContent } from "../../components"

export const SpotifyPage: FC = observer(() => {
	const { SpotifyStore } = useStores()

	useEffect(() => {
		SpotifyStore.initSdk(
			process.env.REACT_APP_SPOTIFY_CLIENT_ID || "",
			process.env.REACT_APP_SPOTIFY_REDIRECT_TARGET || "",
			Scopes.all,
		)
	}, [])
	return (
		<MainLayout>
			<div className="spotify-page">
				<div className="spotify-page__browser">
					{SpotifyStore.SpotifyData.sdk ? (
							<MyContent /> 
					) : (
						<></>
					)}
				</div>
				<div className="spotify-page__player"></div>
			</div>
		</MainLayout>
	)
})

