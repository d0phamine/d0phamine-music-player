import { FC, useEffect, ReactNode } from "react"
import { observer } from "mobx-react-lite"
import { Dropdown } from "antd"

import { useStores } from "../../../store"
import { CustomIcon, CustomListItem, DirDropdown } from "../.."

import { MdFolder, MdOutlineStarPurple500, MdMoreHoriz } from "react-icons/md"

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
							<div className="control-items">
								<DirDropdown trigger={["click"]} dirPath={item.path}>
									<CustomIcon
										onClick={(e: React.MouseEvent) =>
											e.preventDefault()
										}
									>
										<MdMoreHoriz />
									</CustomIcon>
								</DirDropdown>
								<CustomIcon
									onClick={() =>
										FSstore.deletFromFavorites(item.path)
									}
								>
									<MdOutlineStarPurple500
										style={{ color: "gold" }}
									/>
								</CustomIcon>
							</div>
						}
						onClick={() => FSstore.getDirs(item.path)}
					/>
				))}
			</div>
		</div>
	)
})

