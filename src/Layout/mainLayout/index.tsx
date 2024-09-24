import { FC, ReactNode, useEffect } from "react";
import { Titlebar } from "../../components/Titlebar";

import './index.scss'

const { ipcRenderer } = window.require("electron");

export interface ILayout {
	children: ReactNode;
}

export const MainLayout: FC<ILayout> = ({ children }) => {
	return (
		<>
			<div className="layout-wrapper">
				<div className="main-layout">{children}</div>
			</div>
		</>
	);
};