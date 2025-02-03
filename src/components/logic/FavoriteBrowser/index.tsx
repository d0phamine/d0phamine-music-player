import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "store"
import { CustomIcon, CustomListItem, DirDropdown } from "components/ui"

import { MdFolder, MdOutlineStarPurple500, MdMoreHoriz } from "react-icons/md"
import { DirsArr } from "store/FSstore"
import { ITrack } from "store/PlayerStore"

import "./index.scss"

export const FavoriteBrowser: FC = observer(() => {
	const { FSstore, ThemeStore } = useStores()

	useEffect(() => {
		FSstore.getFavoriteDirs()
	}, [FSstore])

	return (
		<div className="favorite-browser">
			<div className="favorite-browser__header">Favorite</div>
			<div className="favorite-browser__list">
				{FSstore.FSdata.favoriteDirs?.map(
					(item: DirsArr | ITrack, index) => (
						<CustomListItem
							key={index}
							title={item.name}
							button={<MdFolder />}
							control={
								<div className="control-items">
									<DirDropdown
										trigger={["click"]}
										dirPath={item.path}
									>
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
											FSstore.deleteFromFavorites(
												item.path,
											)
										}
									>
										<MdOutlineStarPurple500
											style={{ color: "gold" }}
										/>
									</CustomIcon>
								</div>
							}
							onClick={() => FSstore.setBrowserDirs(item.path)}
							style={{
								borderColor:
									ThemeStore.CurrentTheme.borderColor,
							}}
						/>
					),
				)}
			</div>
		</div>
	)
})
