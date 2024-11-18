import { FC } from "react"
import { HashRouter, Route, Routes } from "react-router-dom"
import { MainPage } from "./pages/mainPage"
import { SpotifyPage } from "./pages/spotifyPage"

export const Router: FC = () => {
	return (
		<Routes>
			<Route path="/" element={<MainPage />} />
			<Route path="/spotify-page" element={<SpotifyPage />} />
		</Routes>
	)
}

