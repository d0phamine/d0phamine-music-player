import { FC } from "react"

import { observer } from "mobx-react-lite"

import { LoadingOutlined } from "@ant-design/icons"
import {
	PlaylistedTrack,
	SimplifiedArtist,
	SimplifiedTrack,
} from "@spotify/web-api-ts-sdk"
import { Drawer } from "antd"
import InfiniteScroll from "react-infinite-scroller"

import { useStores } from "store"

import { CustomListItem } from "../../ui"
import "./index.scss"

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
				onClose={() => {
					ComponentStore.changeDrawerOpen()
					SpotifyStore.clearPlaylistItems()
				}}
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
						<InfiniteScroll
							pageStart={0}
							loadMore={() =>
								SpotifyStore.SpotifyData.mediaInfo
									? SpotifyStore.setPlaylistItems(
											SpotifyStore.SpotifyData.mediaInfo
												.id,
											undefined,
											undefined,
											undefined,
											SpotifyStore.SpotifyData
												.playlistItems?.items.length,
										)
									: null
							}
							hasMore={
								SpotifyStore.SpotifyData.playlistItems
									? SpotifyStore.SpotifyData.playlistItems
											?.items.length <
										SpotifyStore.SpotifyData.playlistItems
											?.total
									: false
							}
							useWindow={false}
							loader={
								<div className="centered-class">
									<LoadingOutlined />
								</div>
							}
						>
							{SpotifyStore.SpotifyData.playlistItems?.items.map(
								(item: PlaylistedTrack, index: number) => (
									<CustomListItem
										// @ts-expect-error comment
										title={`${item.track.artists.map(
											(
												item: SimplifiedArtist,
												index: number,
											) => item.name,
										)} - ${item.track.name}`}
										style={{ fontSize: "11px" }}
										key={index}
									/>
								),
							)}
						</InfiniteScroll>
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
					<img
						src={SpotifyStore.SpotifyData.mediaInfo?.images[0].url}
						alt=""
					/>
					<div className="content-description">
						<p>"{SpotifyStore.SpotifyData.mediaInfo?.name}"</p>
						<p>
							{SpotifyStore.SpotifyData.mediaInfo?.artists
								? SpotifyStore.SpotifyData.mediaInfo?.artists.map(
										(
											item: SimplifiedArtist,
											index: number,
										) => `${item.name} `,
									)
								: ""}{" "}
							- {SpotifyStore.SpotifyData.mediaInfo?.total_tracks}{" "}
							треков
						</p>
					</div>
					<div className="content-playlist">
						<InfiniteScroll
							pageStart={0}
							loadMore={() =>
								SpotifyStore.SpotifyData.mediaInfo
									? SpotifyStore.setAlbumItems(
											SpotifyStore.SpotifyData.mediaInfo
												.id,
											undefined,
											undefined,
											SpotifyStore.SpotifyData.albumItems
												?.items.length,
										)
									: null
							}
							hasMore={
								SpotifyStore.SpotifyData.albumItems
									? SpotifyStore.SpotifyData.albumItems?.items
											.length <
										SpotifyStore.SpotifyData.albumItems
											?.total
									: false
							}
							useWindow={false}
							loader={
								<div className="centered-class">
									<LoadingOutlined />
								</div>
							}
						>
							{SpotifyStore.SpotifyData.albumItems?.items.map(
								(item: SimplifiedTrack, index: number) => (
									<CustomListItem
										title={`${item.artists.map(
											(
												item: SimplifiedArtist,
												index: number,
											) => `${item.name}`,
										)} - ${item.name}`}
										style={{ fontSize: "11px" }}
										key={index}
									/>
								),
							)}
						</InfiniteScroll>
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
	}
})
