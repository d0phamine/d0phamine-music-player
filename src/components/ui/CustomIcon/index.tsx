import { FC, ReactNode } from "react"

import "./index.scss"

export interface CustomIconProps {
	children: ReactNode
	onClick?: (e:React.MouseEvent) => void
}

export const CustomIcon: FC<CustomIconProps> = ({onClick=(e: React.MouseEvent) =>
	e.preventDefault(), children}) => {
	return (
		<div className={"custom-icon"} onClick={onClick}>
			{children}
		</div>
	)
}

