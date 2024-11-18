import { makeSpotifyRequest } from "../requestInstance"
import { IUserInfo } from "../../../store/SpotifyStore"

export const getUserInfo = async (
	accessToken: string,
	refreshToken: string,
): Promise<IUserInfo | null> => {
	return await makeSpotifyRequest("GET", "me", accessToken, refreshToken)
}

