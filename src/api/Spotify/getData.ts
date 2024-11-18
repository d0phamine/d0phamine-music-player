import { makeSpotifyRequest } from "./requestInstance"
import { IUserInfo } from "../../store/SpotifyStore"

export const getUserInfo = async (
	accessToken: string,
	refreshToken: string,
): Promise<IUserInfo | null> => {
	return await makeSpotifyRequest("GET", "me", accessToken, refreshToken)
}

export const getUserPlaylists = async (
	accessToken: string,
	refreshToken: string,
	params: { offset:number, limit: number },
): Promise<any> => {
	return await makeSpotifyRequest(
		"GET",
		"me/playlists",
		accessToken,
		refreshToken,
		undefined,
		params,
	)
}

