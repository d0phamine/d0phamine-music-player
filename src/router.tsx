import { FC } from "react"
import { HashRouter, Route, Routes } from "react-router-dom"
import { ConfigProvider, theme } from "antd"
import { MainPage } from "./pages/mainPage"
import { SpotifyPage } from "./pages/spotifyPage"
import { useStores } from "./store"

export const Router: FC = () => {
	const { ThemeStore } = useStores()
	return (
		<ConfigProvider
			theme={{
				algorithm: ThemeStore.CurrentTheme.algorithm,
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
}

