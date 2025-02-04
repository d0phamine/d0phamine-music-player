import { FC, ReactNode } from "react"

import { observer } from "mobx-react-lite"

import { Dropdown } from "antd"
import type { DropdownProps, MenuProps } from "antd"

import { useStores } from "store"

import "./index.scss"

export interface DirDropdownProps extends DropdownProps {
	children: ReactNode
	dirPath: string
	onClick?: () => void
}

export const DirDropdown: FC<DirDropdownProps> = observer((props) => {
	const { ComponentStore, PlayerStore, FSstore } = useStores()

	const onClick: MenuProps["onClick"] = async ({ key }) => {
		if (key === "1") {
			await FSstore.setTracksFromFavoriteDir(props.dirPath)

			// После загрузки данных теперь `tracksFromFavoriteDir` должен быть доступен
			FSstore.FSdata.tracksFromFavoriteDir?.forEach((elem, index) => {
				if (PlayerStore.isITrack(elem)) {
					PlayerStore.addTrackToCurrentPlaylist(elem)
				}
			})
		}
	}
	return (
		<Dropdown
			menu={{
				items: ComponentStore.componentData.dirDropdownItems,
				onClick,
			}}
			{...props} // Передаем дополнительные свойства в Dropdown
		>
			{/* {props.children} */}
		</Dropdown>
	)
})
