import { FC } from "react"

import "./index.scss"

export interface SpotifyListItemProps {
	title?: string | null
	type?: string | null
	owner?: string | null
	image?: string | null
	style?: object
	onClick?: () => void
	customClass?: string
}

export const SpotifyListItem: FC<SpotifyListItemProps> = (props) => {
	return (
		<div
			className={`spotify-list-item ${props.customClass || ""}`}
			style={props.style}
			onClick={props.onClick}
		>
			<div className="spotify-list-item__image">
				{props.image ? <img src={props.image} alt="" /> : null}
			</div>
			<div className="spotify-list-item__content">
				<div className="item-content-title">
					<p>{props.title}</p>
				</div>
				<div className="item-content-type-owner">
					<p>{props.owner ? `${props.type} - ${props.owner}` : `${props.type}`}</p>
				</div>
			</div>
		</div>
	)
}

