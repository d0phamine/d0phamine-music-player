import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"
import { CustomIcon, CustomListItem, DirDropdown } from "../.."

import { MdFolder, MdOutlineStarPurple500, MdMoreHoriz } from "react-icons/md"
import { DirsArr } from "../../../store/FSstore"
import { ITrack } from "../../../store/PlayerStore"

import "./index.scss"


export const FavoriteBrowser: FC = observer(() => {
	const { FSstore } = useStores()

	useEffect(() => {
		FSstore.getFavoriteDirs()
	}, [FSstore])

	
	const  onDeleteFromFavorites = (item:  DirsArr | ITrack ): void => {
		FSstore.deleteFromFavorites(item.path)
		// other  code ...
	}
	const  onSetBrowserDirs = (path: string ): void => {
		FSstore.setBrowserDirs(path)
		// other  code ...
	}

	return (
		<div className="favorite-browser">
			<div className="favorite-browser__header">Favorite</div>
			<div className="favorite-browser__list">
				{FSstore.FSdata.favoriteDirs?.map((item: DirsArr | ITrack, index) => (
					<CustomListItem
						key={index}
						title={item.name}
						button={<MdFolder />}
						control={
							<div className="control-items">
								<DirDropdown trigger={["click"]} dirPath={item.path}>
									<CustomIcon>
										<MdMoreHoriz />
									</CustomIcon>
								</DirDropdown>
								<CustomIcon
									onClick={() =>
										onDeleteFromFavorites(item)
									}
								>
									<MdOutlineStarPurple500
										style={{ color: "gold" }}
									/>
								</CustomIcon>
							</div>
						}
						onClick={() => onSetBrowserDirs(item.path)}
					/>
				))}
			</div>
		</div>
	)
})

