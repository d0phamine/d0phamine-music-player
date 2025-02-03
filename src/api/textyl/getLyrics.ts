import axios from "axios"
const https = window.require("https")

const instance = axios.create({
	baseURL: "http://api.textyl.co/api",
	headers: {
		accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
		"accept-language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7",
		"cache-control": "no-cache",
		pragma: "no-cache",
		priority: "u=0, i",
	},
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
})

// const textTrim = (trackName: string) => {
// 	let trimmedName = trackName.replace(/[-/._&]/g, ' ').replace(/\s+/g, ' ').trim()
// 	console.log(trimmedName)
// 	return trimmedName
// }

export const getLyrics = async (trackName: string) => {
	try {
		const reqUrl = `lyrics?q=${encodeURIComponent(trackName)}`
		const res = await instance.get(reqUrl)

		return res.data
	} catch (err) {
		if (axios.isAxiosError(err) && err.response?.status === 404) {
			console.error("Lyrics not found")
			return undefined
		} else {
			console.error(err)
			throw err // Re-throw the error if it's not a 404
		}
	}
}
