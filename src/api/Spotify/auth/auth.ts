import { redirectToAuth } from "./redirectToAuth"
import { getSpotifyAccessToken } from "./getSpotifyAccessToken"

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || ""
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export const spotifyAuth = async () => {
	if (!code) {
		redirectToAuth(clientId)
	} else {
		try {
			const token_data = await getSpotifyAccessToken(clientId, code)
			localStorage.setItem("spotify_access_token", token_data.access_token)
			localStorage.setItem(
				"spotify_refresh_token",
				token_data.refresh_token,
			)
			return token_data
		} catch (error) {
			console.error("Ошибка при получении токена:", error)
			throw error
		}
	}
}

