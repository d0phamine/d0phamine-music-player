import { FC, ReactNode } from "react"

import "./index.scss"
import { AudioVisualizer } from "../../components"

export interface ILayout {
	children: ReactNode
}

export const MainLayout: FC<ILayout> = ({ children }) => {
	return (
		<>
			<div className="layout-wrapper">
				<div className="visualizer-container">
					<AudioVisualizer />
				</div>
				<div className="main-layout">{children}</div>
			</div>
		</>
	)
}

