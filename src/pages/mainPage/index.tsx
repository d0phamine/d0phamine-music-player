import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { MainLayout } from "../../Layout/mainLayout"

import { useStores } from "../../store"
import { CustomIcon, CustomListItem, BrowserSearch } from "../../components"

import {
	MdFolder,
	MdOutlineKeyboardBackspace,
	MdOutlineStarPurple500,
} from "react-icons/md"
import { Button } from "antd"

import "./index.scss"

export const IndexPage: FC = observer(() => {
	const { FSstore } = useStores()

	useEffect(() => {
		FSstore.getDirs()
		FSstore.getFavoriteDirs()
	}, [])
	return (
		<MainLayout>
			<div className="main-page">
				<div className="main-page__browser">
					<div className="browser-favorites">
						<div className="browser-favorites__header">
							Favorite
						</div>
						<div className="browser-favorites__list">
							{FSstore.FSdata.favoriteDirs?.map(
								(item: any, index) => (
									<CustomListItem
										key={index}
										title={item.name}
										button={<MdFolder />}
										control={
											<CustomIcon
												onClick={() =>
													FSstore.deletFromFavorites(
														item.path,
													)
												}
											>
												<MdOutlineStarPurple500
													style={{ color: "gold" }}
												/>
											</CustomIcon>
										}
										onClick={() =>
											FSstore.getDirs(item.path)
										}
									/>
								),
							)}
						</div>
					</div>
					<div className="browser-list">
						<div className="browser-list__controls">
							<Button
								disabled={
									FSstore.FSdata.homePath ===
									FSstore.FSdata.currentPath
								}
								icon={<MdOutlineKeyboardBackspace />}
								onClick={() => {
									FSstore.getDirs(FSstore.FSdata.previousPath)
								}}
							/>
							<BrowserSearch
								placeholder={FSstore.FSdata.currentPath}
							/>
						</div>
						<div className="browser-list__list">
							{FSstore.FSdata.dirs?.map((item: any, index) => (
								<CustomListItem
									key={index}
									title={item.name}
									button={<MdFolder />}
									onClick={() => FSstore.getDirs(item.path)}
									control={
										<CustomIcon
											onClick={() =>
												FSstore.addToFavoriteDirs(
													item.path,
												)
											}
										>
											<MdOutlineStarPurple500
												style={
													FSstore.FSdata.favoriteDirs.some(
														(dir: any) =>
															dir.path ===
															item.path,
													)
														? { color: "gold" }
														: { color: "white" }
												}
											/>
										</CustomIcon>
									}
									customClass="hover-control"
								/>
							))}
						</div>
					</div>
				</div>
				<div className="main-page__player"></div>
			</div>
		</MainLayout>
	)
})

