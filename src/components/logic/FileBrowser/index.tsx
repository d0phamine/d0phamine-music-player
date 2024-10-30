import { FC } from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"
import { CustomIcon, CustomListItem, BrowserSearch } from "../.."

import {
	MdFolder,
	MdOutlineKeyboardBackspace,
	MdOutlineStarPurple500,
	MdOutlineAudioFile,
} from "react-icons/md"
import { Button } from "antd"

import "./index.scss"

export const FileBrowser: FC = observer(() => {
	const { FSstore, ComponentStore, PlayerStore } = useStores()

	return (
		<div className="file-browser">
			<div className="file-browser__controls">
				<Button
					disabled={
						FSstore.FSdata.homePath === FSstore.FSdata.currentPath
					}
					icon={<MdOutlineKeyboardBackspace />}
					onClick={() => {
						FSstore.clearFilteredDirs()
						ComponentStore.clearBrowserSearchValue()
						FSstore.setBrowserDirs(FSstore.FSdata.previousPath)
					}}
				/>
				<BrowserSearch placeholder={FSstore.FSdata.currentPath} />
			</div>
			<div className="file-browser__list">
				{FSstore.FSdata.loading ? (
					null // Вы можете заменить это на спиннер или другую индикацию
				) : (
					// Рендеринг элементов списка без ul
					(
						FSstore.FSdata.filteredDirs ||
						FSstore.FSdata.browserDirs
					)?.map((item: any, index) => (
						<CustomListItem
							key={index}
							title={item.name}
							button={
								item.type === "directory" ? (
									<MdFolder />
								) : (
									<MdOutlineAudioFile />
								)
							}
							onClick={() => {
								if (item.type === "directory") {
									FSstore.clearFilteredDirs()
									ComponentStore.clearBrowserSearchValue()
									FSstore.setBrowserDirs(item.path)
								} else {
									PlayerStore.addTrackToCurrentPlaylist(item)
									console.log(
										PlayerStore.playerData.currentPlaylist,
									)
								}
							}}
							control={
								item.type === "directory" ? (
									<CustomIcon
										onClick={() =>
											FSstore.addToFavoriteDirs(item.path)
										}
									>
										<MdOutlineStarPurple500
											style={{
												color: FSstore.FSdata.favoriteDirs.some(
													(dir: any) =>
														dir.path === item.path,
												)
													? "gold"
													: "white",
											}}
										/>
									</CustomIcon>
								) : null
							}
							customClass="hover-control"
						/>
					))
				)}
			</div>
		</div>
	)
})

