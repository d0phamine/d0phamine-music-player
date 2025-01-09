import axios from "axios"
import * as cheerio from "cheerio"

const apiKey = process.env.REACT_APP_GENIUS_API_KEY

export const getLyrics = async (trackName: string) => {
	try {
		const reqUrl = `https://api.genius.com/search?q=${encodeURIComponent(
			trackName,
		)}`

		const res = await axios.get(reqUrl, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		})
		const trackUrl = res.data.response.hits[0].result.url
		console.log(trackUrl)
		const lyrics = await extractLyrics(trackUrl)
		console.log(lyrics)
		return lyrics
	} catch (err) {
		console.error(err)
	}
}

const extractLyrics = async (trackUrl: string) => {
	try {
		let { data } = await axios.get(trackUrl)
		const $ = cheerio.load(data)
		let lyrics = $('div[data-lyrics-container="true"]')
		lyrics.find("span").each((i, elem) => {
			if ($(elem).text().trim() === "") {
				$(elem).remove()
			}
		})

		// Replace <br> with newline character
		lyrics.find("br").replaceWith("\n")

		// Get the text content
		let lyricsText = lyrics.text().trim()

		if (!lyricsText) return null
		return lyricsText
	} catch (err) {
		console.error(err, "Текста к этому треку еще не придумали..(")
	}
}

