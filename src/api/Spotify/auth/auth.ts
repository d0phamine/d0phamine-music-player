import { redirectToAuth } from "./redirectToAuth"
import { getSpotifyAccessToken } from "./getSpotifyAccessToken"

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || ""
const code = undefined

export const spotifyAuth = async () => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
        redirectToAuth(clientId);
    } else {
        try {
            const accessToken = await getSpotifyAccessToken(clientId, code);
            localStorage.setItem("spotify_access_token", accessToken);
            return accessToken;
        } catch (error) {
            console.error("Ошибка при получении токена:", error);
            throw error;
        }
    }
};

