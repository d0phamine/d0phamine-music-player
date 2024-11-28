import { FC } from "react"
import { observer } from "mobx-react-lite"
import { Drawer } from "antd"

import { useStores } from "../../../store"
import { PlaylistedTrack } from "@spotify/web-api-ts-sdk"

import "./index.scss"
import { CustomListItem } from "../../ui"

export interface PlaylistDrawerProps {
	style?: {}
}

export const PlaylistDrawer: FC<PlaylistDrawerProps> = observer((props) => {
	const { ComponentStore, SpotifyStore } = useStores()

	const stripHtmlTags = (input: string): string => {
		if (!input) return "" // Если строка пустая, возвращаем пустую строку
		const div = document.createElement("div")
		div.innerHTML = input // Интерпретируем строку как HTML
		return div.textContent || div.innerText || "" // Извлекаем текстовое содержимое
	}

	// Проверяем и обрабатываем props.title
	const cleanedDescription =
		typeof SpotifyStore.SpotifyData.mediaInfo?.description === "string"
			? stripHtmlTags(SpotifyStore.SpotifyData.mediaInfo?.description)
			: ""

	if (SpotifyStore.SpotifyData.mediaInfo?.type === "playlist") {
		return (
			<Drawer
				className="playlist-drawer"
				closable={false}
				onClose={() => ComponentStore.changeDrawerOpen()}
				open={ComponentStore.componentData.drawerOpen}
				getContainer={false}
				style={props.style}
			>
				<div className="playlist-drawer__content">
					<img
						src={SpotifyStore.SpotifyData.mediaInfo?.images[0].url}
						alt=""
					/>
					<div className="content-description">
						<p>"{cleanedDescription}"</p>
						<p>
							{SpotifyStore.SpotifyData.mediaInfo?.owner
								? SpotifyStore.SpotifyData.mediaInfo?.owner
										.display_name
								: ""}{" "}
							-{" "}
							{SpotifyStore.SpotifyData.mediaInfo?.tracks?.total}{" "}
							треков
						</p>
					</div>
					<div className="content-playlist">
						{SpotifyStore.SpotifyData.playlistItems?.items.map(
							(item: PlaylistedTrack, index: number) => (
								<CustomListItem title={`${item.track.name}`} />
							),
						)}
					</div>
				</div>
				{/* <Drawer
					className="playlist-drawer__children"
					title="Create Playlist"
					style={props.style}
					closable={false}
					onClose={() => ComponentStore.changeChildrenDrawer()}
					open={ComponentStore.componentData.childrenDrawer}
				></Drawer> */}
			</Drawer>
		)
	} else {
		return (
			<Drawer
				className="playlist-drawer"
				closable={false}
				onClose={() => ComponentStore.changeDrawerOpen()}
				open={ComponentStore.componentData.drawerOpen}
				getContainer={false}
				style={props.style}
			>
				<div className="playlist-drawer__content">
					{/* <img
						src={SpotifyStore.SpotifyData.mediaInfo?.images[0].url}
						alt=""
					/>
					<div className="content-description">
						<p>"{cleanedDescription}"</p>
						<p>
							{SpotifyStore.SpotifyData.mediaInfo?.owner
								? SpotifyStore.SpotifyData.mediaInfo?.owner
										.display_name
								: ""}{" "}
							-{" "}
							{SpotifyStore.SpotifyData.mediaInfo?.tracks?.total}{" "}
							треков
						</p>
					</div>
					<div className="content-playlist">
						{SpotifyStore.SpotifyData.playlistItems?.items.map(
							(item: PlaylistedTrack, index: number) => (
								<CustomListItem title={`${item.track.name}`} />
							),
						)}
					</div> */}
				</div>
				{/* <Drawer
					className="playlist-drawer__children"
					title="Create Playlist"
					style={props.style}
					closable={false}
					onClose={() => ComponentStore.changeChildrenDrawer()}
					open={ComponentStore.componentData.childrenDrawer}
				></Drawer> */}
			</Drawer>
		)
	}
})

