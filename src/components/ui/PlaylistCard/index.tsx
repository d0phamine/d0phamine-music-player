import { FC } from "react"

import { SimplifiedArtist } from "@spotify/web-api-ts-sdk"

import "./index.scss"

export interface PlaylistCardProps {
	type?: "album" | "playlist"
	title?: string
	artists?: SimplifiedArtist[]
	cover?: string
	onClick?: () => void
}

export const PlaylistCard: FC<PlaylistCardProps> = (props) => {
	const stripHtmlTags = (input: string): string => {
		if (!input) return "" // Если строка пустая, возвращаем пустую строку
		const div = document.createElement("div")
		div.innerHTML = input // Интерпретируем строку как HTML
		return div.textContent || div.innerText || "" // Извлекаем текстовое содержимое
	}

	// Проверяем и обрабатываем props.title
	const cleanedTitle =
		typeof props.title === "string" ? stripHtmlTags(props.title) : ""

	return (
		<div className="playlist-card" onClick={props.onClick}>
			<div className="playlist-card__cover">
				<img src={props.cover} alt="" />
			</div>
			<div className="playlist-card__title">
				{props.type === "album" ? (
					<div className="title-release">
						<div className="title-release__name">{props.title}</div>
						<div className="title-release__artists">
							{props.artists?.map(
								(item: SimplifiedArtist, index) =>
									`${item.name}`,
							)}
						</div>
					</div>
				) : (
					<div className="title-description">
						<p>{cleanedTitle}</p>
					</div>
				)}
			</div>
		</div>
	)
}
