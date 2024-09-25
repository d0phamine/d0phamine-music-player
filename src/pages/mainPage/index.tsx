import { FC, useEffect } from "react";
import { MainLayout } from "../../Layout/mainLayout";
import { channels } from "../../shared/constants";

const { ipcRenderer } = window.require("electron");

export const IndexPage: FC = () => {
	const getDirs = (dir?:string) => {
		ipcRenderer.send(channels.GET_DIR, {dir});
	};

	useEffect(() => {
		getDirs();

		ipcRenderer.on('directory-files', (event:any, receivedFiles:any) => {
			console.log(receivedFiles) // Обновляем состояние при получении файлов
		});

		ipcRenderer.on('directory-error', (event:any, errorMessage:any) => {
			console.log(errorMessage);
		});

		return () => {
			ipcRenderer.removeAllListeners('directory-files')
			ipcRenderer.removeAllListeners('directory-error')
		}

	}, []);

	return (
		<MainLayout>
			<div>Hello main (new update!)</div>
		</MainLayout>
	);
};

