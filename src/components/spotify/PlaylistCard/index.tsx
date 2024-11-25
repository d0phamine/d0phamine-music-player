import { FC, useEffect } from "react"

import { Artist, SimplifiedArtist } from "@spotify/web-api-ts-sdk"

import "./index.scss"

export interface PlaylistCardProps {
	type?: "album" | "playlist"
	title?: string
	artists?: SimplifiedArtist[]
	cover?: string
}

export const PlaylistCard: FC<PlaylistCardProps> = (props) => {
	return (
		<div className="playlist-card">
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
						<p>{props.title}</p>
					</div>
				)}
			</div>
		</div>
	)
}

