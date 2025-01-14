import { FC, MutableRefObject } from "react"
import { observer } from "mobx-react-lite"
import ReactHowler from "react-howler"

import { Slider } from "antd"

import { useStores } from "store"

import "./index.scss"

export interface TrackProgressBarProps {
	howlerRef: MutableRefObject<ReactHowler | null>
}

export const TrackProgressBar: FC<TrackProgressBarProps> = observer((props) => {
	const { PlayerStore, ThemeStore } = useStores()

	const handleSliderChange = (value: number) => {
		if (props.howlerRef.current) {
			props.howlerRef.current.seek(value) // Устанавливаем новое положение трека через seek
			PlayerStore.setCurrentTimeOfPlay(value) // Обновляем текущее время в вашем хранилище
		}
	}

	return (
		<Slider
			className={
				ThemeStore.CurrentTheme === ThemeStore.DarkTheme
					? "track-progress-bar dark"
					: "track-progress-bar light"
			}
			min={0}
			max={PlayerStore.playerData.selectedTrack?.duration || 0}
			tooltip={{ formatter: null }}
			value={
				PlayerStore.playerData.currentTimeOfPlay == null
					? 0
					: PlayerStore.playerData.currentTimeOfPlay
			}
			onChange={handleSliderChange}
		/>
	)
})

