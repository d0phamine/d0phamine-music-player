import { FC, MutableRefObject, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import ReactHowler from "react-howler"
import { useDebouncedCallback } from "use-debounce"
import { Slider } from "antd"
import { useStores } from "store"

import "./index.scss"

export interface TrackProgressBarProps {
	howlerRef: MutableRefObject<ReactHowler | null>
}

export const TrackProgressBar: FC<TrackProgressBarProps> = observer((props) => {
	const { PlayerStore, ThemeStore } = useStores()
	const [sliderValue, setSliderValue] = useState<number>(0)
	const [isSliding, setIsSliding] = useState<boolean>(false)

	useEffect(() => {
		if (!isSliding) {
			setSliderValue(PlayerStore.playerData.currentTimeOfPlay || 0)
		}
	}, [PlayerStore.playerData.currentTimeOfPlay, isSliding])

	const handleSliderChange = (value: number) => {
		setSliderValue(value)
		setIsSliding(true)
	}

	const handleSliderChangeDebounced = useDebouncedCallback(
		(value: number) => {
			if (props.howlerRef.current) {
				props.howlerRef.current.seek(value) // Устанавливаем новое положение трека через seek
				PlayerStore.setCurrentSeekOfPlay(value)
				PlayerStore.setCurrentTimeOfPlay(value) // Обновляем текущее время в вашем хранилище
			}
			setIsSliding(false)
		},
		100,
	)

	const handleAfterChange = (value: number) => {
		handleSliderChangeDebounced(value)
	}

	return (
		<Slider
			className={
				ThemeStore.CurrentTheme === ThemeStore.DarkTheme
					? "track-progress-bar dark"
					: "track-progress-bar light"
			}
			tooltip={{ formatter: null }}
			min={0}
			max={PlayerStore.playerData.selectedTrack?.duration || 0}
			value={sliderValue}
			onChange={handleSliderChange}
			onChangeComplete={handleAfterChange}
		/>
	)
})

