import { redirectToAuth } from "./redirectToAuth"
import { getSpotifyAccessToken } from "./getSpotifyAccessToken"

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || ""

export const spotifyAuth = async (): Promise<{ access_token: string; refresh_token: string } | null> => {
	// Получаем "code" из URL
	const code = new URLSearchParams(window.location.search).get("code");
  
	// Если код отсутствует, то выполняем редирект на авторизацию
	if (!code) {
	  redirectToAuth(clientId);
	  return null; // Возвращаем null, чтобы не продолжать выполнение функции
	}
  
	try {
	  // Если код есть, получаем токены
	  const token_data = await getSpotifyAccessToken(clientId, code);
	  
	  // Сохраняем полученные токены в localStorage
	  localStorage.setItem("spotify_access_token", token_data.access_token);
	  localStorage.setItem("spotify_refresh_token", token_data.refresh_token);
  
	  // Возвращаем данные о токенах
	  return token_data;
	} catch (error) {
	  console.error("Ошибка при получении токена:", error);
	  throw error; // Пробрасываем ошибку, чтобы вызывающая сторона могла обработать
	}
  }

  

