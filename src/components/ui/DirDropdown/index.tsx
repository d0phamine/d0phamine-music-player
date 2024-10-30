import { FC, ReactNode, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Dropdown } from "antd"
import type { MenuProps, DropdownProps } from "antd"

import { useStores } from "../../../store"

import "./index.scss"

export interface DirDropdownProps extends DropdownProps {
	children: ReactNode
	dirPath: string
	onClick?: () => void
}

export const DirDropdown: FC<DirDropdownProps> = observer((props) => {
	const { ComponentStore, PlayerStore, FSstore } = useStores()

	const onClick: MenuProps["onClick"] = ({ key }) => {}

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

