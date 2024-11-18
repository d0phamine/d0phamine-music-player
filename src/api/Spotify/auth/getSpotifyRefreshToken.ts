import axios from "axios"

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || ""

export const getSpotifyRefreshToken = async (
	refreshToken: string,
): Promise<{access_token:string, refresh_token:string} | null> => {
	try {
		const payload = {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
				client_id: clientId,
			}),
		}

		const result = await axios.post(
			"https://accounts.spotify.com/api/token",
			payload,
			{},
		)

    console.log(result.data)
		return result.data
	} catch (error) {
		console.error("Error refreshing access token", error)
		return null // Если не удалось обновить токен
	}
}
