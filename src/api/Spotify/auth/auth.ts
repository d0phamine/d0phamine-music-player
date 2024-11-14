import { redirectToAuth } from "./redirectToAuth"
import { getAccessToken } from "./getAccessToken"

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || ""
const code = undefined

export const spotifyAuth = async () => {
	if (!code) {
		redirectToAuth(clientId)
	} else {
		const accessToken = await getAccessToken(clientId, code)
        console.log(accessToken)
        return accessToken
	}
}

