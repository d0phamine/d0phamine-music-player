import { FC, useEffect } from "react";
import { MainLayout } from "../../Layout/mainLayout";
import { channels } from "../../shared/constants";

const { ipcRenderer } = window.require("electron");

export const IndexPage: FC = () => {
	const getDirs = () => {
		ipcRenderer.send(channels.GET_DIR, {dir:'/Users/gregorysizov/Documents'});
	};

	useEffect(() => {
		getDirs();
		ipcRenderer.on(channels.GET_DIR, (event:any, arg:any) => {
			console.log(arg)
		})
	}, []);

	return (
		<MainLayout>
			<div>Hello main (new update!)</div>
		</MainLayout>
	);
};

