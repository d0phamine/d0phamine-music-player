import { FC, ReactNode } from "react"

import { AudioVisualizer } from "../../components"
import { useStores } from "../../store"

import "./index.scss"

export interface ILayout {
	children: ReactNode
}

export const MainLayout: FC<ILayout> = ({ children }) => {
	const { ThemeStore } = useStores()
	return (
		<>
			<div
				className="layout-wrapper"
				style={{
					backgroundColor: ThemeStore.CurrentTheme.backgroundColor,
					borderColor: ThemeStore.CurrentTheme.borderColor,
					color: ThemeStore.CurrentTheme.fontColor
				}}
			>
				<div className="visualizer-container">
					<AudioVisualizer />
				</div>
				<div className="main-layout">{children}</div>
			</div>
		</>
	)
}

