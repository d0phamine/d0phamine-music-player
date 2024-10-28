import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"
import { CustomIcon, CustomListItem } from "../.."

import {
	MdFolder,
	MdOutlineStarPurple500,
} from "react-icons/md"

import "./index.scss"

export const FavoriteBrowser: FC = observer(() => {
	const { FSstore } = useStores()

	useEffect(() => {
		FSstore.getFavoriteDirs()
	}, [FSstore])

	return (
		<div className="favorite-browser">
			<div className="favorite-browser__header">Favorite</div>
			<div className="favorite-browser__list">
				{FSstore.FSdata.favoriteDirs?.map((item: any, index) => (
					<CustomListItem
						key={index}
						title={item.name}
						button={<MdFolder />}
						control={
							<CustomIcon
								onClick={() =>
									FSstore.deletFromFavorites(item.path)
								}
							>
								<MdOutlineStarPurple500
									style={{ color: "gold" }}
								/>
							</CustomIcon>
						}
						onClick={() => FSstore.getDirs(item.path)}
					/>
				))}
			</div>
		</div>
	)
})

