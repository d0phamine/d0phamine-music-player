import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { CustomListItem } from "../../"
import { useStores } from "../../../store"
import { ITrack } from "../../../store/PlayerStore"

import { MdOutlineAudioFile } from "react-icons/md"

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
						title={item.name}
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
		</div>
	)
})

