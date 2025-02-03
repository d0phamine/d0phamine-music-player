import { FC } from "react"
import { LoadingOutlined } from "@ant-design/icons"

import "./index.scss"

export interface ICustomLoaderProps {
	style?: object
}

export const CustomLoader: FC<ICustomLoaderProps> = ({
	style = { fontSize: "32px" },
}) => {
	return (
		<div className="custom-loader">
			<LoadingOutlined spin style={style} />
		</div>
	)
}
