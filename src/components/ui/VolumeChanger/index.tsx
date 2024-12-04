import { FC } from "react"
import { observer } from "mobx-react-lite"

import { Slider } from "antd"

import { useStores } from "../../../store"

import "./index.scss"

export const VolumeChanger: FC = observer(() => {
	const { PlayerStore } = useStores()
	return (
		<Slider
			className="volume-changer"
			tooltip={{ formatter: null }}
			value={PlayerStore.playerData.playerVolume * 100}
            onChange={(value:number) => PlayerStore.setPlayerVolume(value / 100)}
			style={{}}
		/>
	)
})
