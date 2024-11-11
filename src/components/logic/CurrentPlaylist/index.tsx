import { FC, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"

import { CustomListItem, PlaylistDrawer } from "../../"
import { useStores } from "../../../store"
import { ITrack } from "../../../store/PlayerStore"

import { MdOutlineAudioFile } from "react-icons/md"
import { RiPlayList2Fill } from "react-icons/ri"
import { IoMdMenu } from "react-icons/io"
import { FloatButton } from "antd"

import "./index.scss"

export const CurrentPlaylist: FC = observer(() => {
	const { PlayerStore, ComponentStore } = useStores()
	const containerRef = useRef<HTMLDivElement | null>(null)

	const updateContainerSize = () => {
		if (containerRef.current) {
			ComponentStore.setContainerRefSize(containerRef)
		}
	}

	useEffect(() => {
		updateContainerSize()
	}, [PlayerStore.playerData.currentPlaylist])

	useEffect(() => {
		window.addEventListener("resize", updateContainerSize)
		return () => {
			window.removeEventListener("resize", updateContainerSize)
		}
	}, [])

	return (
		<div className="current-playlist" ref={containerRef}>
			{PlayerStore.playerData.currentPlaylist?.map(
				(item: ITrack, index) => (
					<CustomListItem
						key={index}
						title={
							item.artist
								? `${item.artist} - ${item.name}`
								: item.name
						}
						button={<MdOutlineAudioFile />}
						onClick={() => {
							PlayerStore.setSelectedTrackInCurrentPlaylist(item)
						}}
						style={
							item.selected ? { backgroundColor: "green" } : {}
						}
					/>
				),
			)}
			<PlaylistDrawer
				style={{
					height: ComponentStore.componentData.containerRefSize
						.height,
				}}
			/>
			<FloatButton.Group
				trigger="click"
				type="primary"
				style={{ insetInlineEnd: 24 }}
				icon={<IoMdMenu />}
			>
				<FloatButton
					icon={<RiPlayList2Fill />}
					onClick={() => ComponentStore.changeDrawerOpen()}
				/>
			</FloatButton.Group>
		</div>
	)
})

