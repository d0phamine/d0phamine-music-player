import { FC } from "react"
import { observer } from "mobx-react-lite"

import { CustomListItem } from "../../"
import { useStores } from "../../../store"
import { ITrack } from "../../../store/PlayerStore"

import { MdOutlineAudioFile, MdCleaningServices } from "react-icons/md"
import { IoMdMenu } from "react-icons/io"
import { FloatButton } from "antd"

import "./index.scss"

export const CurrentPlaylist: FC = observer(() => {
	const { PlayerStore } = useStores()

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
							item.selected ? { backgroundColor: "green" } : {}
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
					icon={<MdCleaningServices />}
					onClick={() => PlayerStore.cleanCurrentPlaylist()}
				/>
			</FloatButton.Group>
		</div>
	)
})

