import { FC } from "react"
import { observer } from "mobx-react-lite"

import { Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { useStores } from "../../../store"

import "./index.scss"
import { SizeType } from "antd/es/config-provider/SizeContext"

export interface CustomSearchProps {
	size?: SizeType
	placeholder?: string
}

export const BrowserSearch: FC<CustomSearchProps> = observer((props) => {
	const { FSstore, ComponentStore} = useStores()

	const onSearch = (value: string) => {
		ComponentStore.getBrowserSearchValue(value)
		FSstore.filterDirsByValue(value)
	}

	return (
		<Input
			className={"custom-search"}
			placeholder={props.placeholder}
			suffix={<SearchOutlined />}
			size={props.size}
			onChange={(e) => onSearch(e.target.value)}
			value={ComponentStore.componentData.browserSearchValue}
		/>
	)
})

