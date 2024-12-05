import { FC } from "react"
import { observer } from "mobx-react-lite"

import { Slider } from "antd"

import { useStores } from "../../../store"

import "./index.scss"

export const VolumeChanger: FC = observer(() => {
	const { PlayerStore, ThemeStore } = useStores()
	return (
		<Slider
			className={ThemeStore.CurrentTheme === ThemeStore.DarkTheme ? "volume-changer dark" : "volume-changer light"}
			tooltip={{ formatter: null }}
			value={PlayerStore.playerData.playerVolume * 100}
            onChange={(value:number) => PlayerStore.setPlayerVolume(value / 100)}
			// style={{backgroundColor:ThemeStore.CurrentTheme.fontColor}}
		/>
	)
})
