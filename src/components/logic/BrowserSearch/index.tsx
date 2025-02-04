import { FC } from "react"

import { observer } from "mobx-react-lite"

import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { SizeType } from "antd/es/config-provider/SizeContext"

import { useStores } from "store"

import "./index.scss"

export interface CustomSearchProps {
	size?: SizeType
	placeholder?: string
}

export const BrowserSearch: FC<CustomSearchProps> = observer((props) => {
	const { FSstore, ComponentStore } = useStores()

	const onSearch = (value: string) => {
		ComponentStore.getBrowserSearchValue(value)
		FSstore.filterDirsByValue(value)
	}

	return (
		<Input
			className={"browser-search"}
			placeholder={props.placeholder}
			suffix={<SearchOutlined />}
			size={props.size}
			onChange={(e) => onSearch(e.target.value)}
			value={ComponentStore.componentData.browserSearchValue}
		/>
	)
})
