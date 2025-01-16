import { FC } from "react"
import { Spin } from "antd"
import type { SpinIndicator } from "antd/es/spin"
import { LoadingOutlined } from "@ant-design/icons"

import "./index.scss"

export interface ICustomLoader {
	size?: "default" | "small" | "large" | undefined
	indicator?: SpinIndicator | undefined
}

export const CustomLoader: FC<ICustomLoader> = ({
	size = "large",
	indicator = <LoadingOutlined spin />,
}) => {
	return (
		<div className="custom-loader">
			<Spin size={size} indicator={indicator} />
		</div>
	)
}

