import { FC, useEffect } from "react"

import { observer } from "mobx-react-lite"

import { ConfigProvider, theme } from "antd"
import { Route, Routes } from "react-router-dom"

import { MainPage } from "./pages/mainPage"
import { SpotifyPage } from "./pages/spotifyPage"
import { useStores } from "./store"

export const Router: FC = observer(() => {
	const { ThemeStore, ComponentStore } = useStores()

	useEffect(() => {
		ThemeStore.setTheme()
		ComponentStore.setShowAudiovisualization()
	}, [])

	return (
		<ConfigProvider
			theme={{
				algorithm:
					ThemeStore.CurrentTheme === ThemeStore.DarkTheme
						? theme.darkAlgorithm
						: theme.defaultAlgorithm,
				token: {
					// Seed Token
					colorPrimary: "#6f56d0",
				},
			}}
		>
			<Routes>
				<Route path="/" element={<MainPage />} />

				{/* <Route path="/spotify-page" element={<SpotifyPage />} /> */}
			</Routes>
		</ConfigProvider>
	)
})
