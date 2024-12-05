import { FC, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { ConfigProvider, theme } from "antd"
import { MainPage } from "./pages/mainPage"
import { SpotifyPage } from "./pages/spotifyPage"
import { useStores } from "./store"
import { observer } from "mobx-react-lite"

export const Router: FC = observer(() => {
	const { ThemeStore } = useStores()

	useEffect(() => {
		ThemeStore.setTheme()
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

