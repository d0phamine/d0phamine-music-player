import { FC } from "react"
import { observer } from "mobx-react-lite"

import { CustomListItem } from "components/ui"
import { useStores } from "store"
import { ITrack } from "store/PlayerStore"

import {
	MdOutlineAudioFile,
	MdCleaningServices,
	MdDarkMode,
} from "react-icons/md"
import { GiLaserBurst } from "react-icons/gi"
import { IoMdMenu } from "react-icons/io"
import { FloatButton } from "antd"

import "./index.scss"

export const CurrentPlaylist: FC = observer(() => {
	const { PlayerStore, ThemeStore, ComponentStore } = useStores()

	return (
		<div className="current-playlist">
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
							item.selected
								? {
										backgroundColor:
											ThemeStore.CurrentTheme
												.playingTrackColor,
										borderColor:
											ThemeStore.CurrentTheme.borderColor,
									}
								: {
										borderColor:
											ThemeStore.CurrentTheme.borderColor,
									}
						}
					/>
				),
			)}

			<FloatButton.Group
				trigger="click"
				type="primary"
				style={{ insetInlineEnd: 24 }}
				icon={<IoMdMenu />}
			>
				<FloatButton
					icon={<GiLaserBurst />}
					onClick={() =>
						ComponentStore.switchShowAudiovisualization()
					}
					type={
						ComponentStore.componentData.showAudioVisualization
							? "primary"
							: "default"
					}
				/>
				<FloatButton
					icon={<MdDarkMode />}
					onClick={() => ThemeStore.switchTheme()}
				/>
				<FloatButton
					icon={<MdCleaningServices />}
					onClick={() => PlayerStore.cleanCurrentPlaylist()}
				/>
			</FloatButton.Group>
		</div>
	)
})
