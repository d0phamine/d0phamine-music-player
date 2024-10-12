import { FC } from "react";
import { observer } from "mobx-react-lite";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useStores } from "../../store";

import "./index.scss";
import { SizeType } from "antd/es/config-provider/SizeContext";

export interface CustomSearchProps {
	size?: SizeType;
	placeholder?: string;
}

export const BrowserSearch: FC<CustomSearchProps> = observer((props) => {
	const { FSstore } = useStores();

	const onSearch = (value: string) => {
		console.log(value);

	// 	if (FSstore.FSdata.dirs != null) {
	// 		// Предположим, что FSstore.FSdata.dirs — это массив объектов с полем name
	// 		const searchedItems= FSstore.FSdata.dirs.filter(
	// 			(item: { name: string }) =>
	// 				item.name.toLowerCase().includes(value.toLowerCase()), // Игнорируем регистр при поиске
	// 		);
	// 		FSstore.putDirs(searchedItems)
	// 	}
	};

	return (
		<Input
			className={"custom-search"}
			placeholder={props.placeholder}
			suffix={<SearchOutlined />}
			size={props.size}
			onChange={(e) => onSearch(e.target.value)}
		/>
	);
});

