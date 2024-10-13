import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { MainLayout } from "../../Layout/mainLayout"

import { useStores } from "../../store"
import { CustomIcon, CustomListItem } from "../../components"

import { MdFolder, MdOutlineStarPurple500 } from "react-icons/md"

import "./index.scss"
import { FileBrowser } from "../../components"
import { FavoriteBrowser } from "../../components/logic/FavoriteBrowser"

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
					<FavoriteBrowser/>
					<FileBrowser/>
				</div>
				<div className="main-page__player"></div>
			</div>
		</MainLayout>
	)
})

