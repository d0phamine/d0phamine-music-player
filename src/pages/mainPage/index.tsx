import { FC, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { MainLayout } from "../../Layout/mainLayout";
import { channels } from "../../shared/constants";
import { useStores } from "../../store";
import { CustomListItem, CustomSearch } from "../../components";

import { MdFolder, MdOutlineKeyboardBackspace } from "react-icons/md";
import { Button } from "antd";

import "./index.scss";

const { ipcRenderer } = window.require("electron");

export const IndexPage: FC = observer(() => {
	const { FSstore } = useStores();

	const getDirs = (dir?: string) => {
		ipcRenderer.send(channels.GET_DIR, { dir });
	};

	useEffect(() => {
		getDirs();

		ipcRenderer.on(
			"directory-files",
			(event: any, receivedFiles: [], path: string) => {
				// Обновляем состояние при получении файлов
				FSstore.getCatalogue(receivedFiles);
				FSstore.getPath(path);
			},
		);

		ipcRenderer.on("directory-error", (event: any, errorMessage: any) => {
			console.log(errorMessage);
		});

		return () => {
			ipcRenderer.removeAllListeners("directory-files");
			ipcRenderer.removeAllListeners("directory-error");
		};
	}, []);

	return (
		<MainLayout>
			<div className="main-page">
				<div className="main-page__browser">
					<div className="browser-search"></div>
					<div className="browser-list">
						<div className="browser-list__controls">
							<Button
								disabled={
									FSstore.FSdata.homePath ===
									FSstore.FSdata.currentPath
								}
								icon={<MdOutlineKeyboardBackspace />}
								onClick={() => {
									getDirs(FSstore.FSdata.previousPath);
								}}
							/>
							<CustomSearch
								placeholder={FSstore.FSdata.currentPath}
							/>
						</div>
						<div className="browser-list__list">
							{FSstore.FSdata.dirs?.map((item: any, index) => (
								<CustomListItem
									key={index}
									title={item.name}
									button={<MdFolder />}
									onClick={() => getDirs(item.path)}
								/>
							))}
						</div>
					</div>
				</div>
				<div className="main-page__player"></div>
			</div>
		</MainLayout>
	);
});

