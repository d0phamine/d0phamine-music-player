import axios, { Method } from "axios"
import { getSpotifyRefreshToken } from "./auth/getSpotifyRefreshToken" // Функция обновления токена

// Создаем экземпляр axios
export const axiosSpotifyInstance = axios.create({
	baseURL: "https://api.spotify.com/v1/",
	headers: {
		"Content-Type": "application/json",
	},
})

// Универсальная обертка для выполнения запросов
export const makeSpotifyRequest = async <T>(
	method: Method,
	url: string,
	accessToken: string,
	refreshToken: string,
	data?: any, // Данные для POST, PUT, DELETE запросов
	params?: Record<string, any>, // Параметры для GET запросов
): Promise<T | null> => {
	try {
		// Выполняем запрос с текущим токеном
		const response = await axiosSpotifyInstance.request<T>({
			method,
			url,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			data,
			params,
		})

		return response.data // Успешный ответ
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			// Если токен истек (ошибка 401), пробуем обновить токен
			if (error.response.status === 401) {
				const newToken = await getSpotifyRefreshToken(refreshToken)
				if (newToken) {
					console.log(newToken)
					// Сохраняем новый токен и повторяем запрос с новым токеном
					localStorage.setItem("access_token", newToken.access_token)
					localStorage.setItem(
						"refresh_token",
						newToken.refresh_token,
					)
					return await makeSpotifyRequest(
						method,
						url,
						newToken.access_token,
						newToken.refresh_token,
						data,
						params,
					)
				}
			}
		}
		throw error // Если ошибка не связана с токеном, пробрасываем её дальше
	}
}

