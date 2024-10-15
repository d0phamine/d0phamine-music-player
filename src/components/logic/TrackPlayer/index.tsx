import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { Button } from "antd"
import {
	MdPlayCircle,
	MdSkipNext,
	MdSkipPrevious,
	MdShuffle,
	MdRepeat,
	MdVolumeUp,
} from "react-icons/md"

import { useStores } from "../../../store"
import { CustomIcon, CustomListItem, BrowserSearch } from "../.."

import "./index.scss"

export const TrackPlayer: FC = observer(() => {
	return (
		<div className="track-player">
			<div className="track-player__controls">
				<MdSkipPrevious style={{ fontSize: "24px" }} />
				<MdPlayCircle style={{ fontSize: "32px" }} />
				<MdSkipNext style={{ fontSize: "24px" }} />
			</div>
			<div className="track-player__play-mode">
				<MdShuffle />
				<MdRepeat />
			</div>
			<div className="track-player__cover"></div>
			<div className="track-player__info">
                <div className="info-track-name">
                    <p>Cheerleader</p>
                </div>
                <div className="info-track-executor">
                    <p>0:00</p>
                </div>
                <div className="info-track-progress"></div>
            </div>
			<MdVolumeUp />
			<div className="track-player__volume"></div>
		</div>
	)
})

