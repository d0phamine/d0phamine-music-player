import axios from "axios";
import { redirectToAuth } from "./redirectToAuth";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || "";

// Функция для получения нового access_token через refresh_token
export const getSpotifyRefreshToken = async (
  refreshToken: string
): Promise<{ access_token: string; refresh_token: string } | null> => {
  console.log("Attempting to refresh token with refreshToken:", refreshToken);

  // Если refreshToken отсутствует, выводим ошибку
  if (!refreshToken) {
    console.error("No refresh token provided");
    return null;
  }

  try {
    // Формируем данные для запроса
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    });

    console.log("Sending refresh token request with params:", params.toString());

    // Делаем запрос на сервер Spotify
    const result = await axios.post(
      "https://accounts.spotify.com/api/token",
      params.toString(), // Делаем запрос с параметрами в виде строки
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Successfully refreshed token:", result.data);
    return result.data; // Возвращаем новый токен
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
		console.log(status)
      // Логируем подробности ответа при ошибке
      console.error("Error response data:", data);

      if (status === 400 && data.error === "invalid_grant") {
        // Если токен обновления был отозван
        console.error("Refresh token has been revoked. Redirecting to authentication...");
        
        // Очистка локальных токенов, если нужно
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");

        // Перенаправление на страницу авторизации
        redirectToAuth(clientId);
      } else {
        // Для других ошибок выводим сообщение
        console.error(`Error refreshing token: ${data.error}`);
      }
    } else {
      console.error("Error occurred while refreshing token:", error);
    }
  }

  // Возвращаем null, если запрос не удался
  return null;
};