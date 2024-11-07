import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { CustomListItem } from "../../"
import { useStores } from "../../../store"
import { ITrack } from "../../../store/PlayerStore"

import { MdOutlineAudioFile} from "react-icons/md"
import { RiPlayList2Fill } from "react-icons/ri";
import { IoMdMenu } from "react-icons/io"
import { FloatButton } from "antd"

import "./index.scss"

export const CurrentPlaylist: FC = observer(() => {
	const { PlayerStore } = useStores()

	useEffect(() => {}, [PlayerStore.playerData.currentPlaylist])

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
				<FloatButton icon={<RiPlayList2Fill />} />
			</FloatButton.Group>
		</div>
	)
})

