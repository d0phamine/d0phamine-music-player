import { FC, ReactNode } from "react"

import "./index.scss"

export interface ILayout {
	children: ReactNode
}

export const MainLayout: FC<ILayout> = ({ children }) => {
	return (
		<>
			<div className="layout-wrapper">
				<div className="main-layout">{children}</div>
			</div>
		</>
	)
}
