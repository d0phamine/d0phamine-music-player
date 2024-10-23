import { FC } from "react"
import { observer } from "mobx-react-lite"

import { Slider } from 'antd';

import { useStores } from "../../../store"

import "./index.scss"

export const TrackProgressBar:FC = observer(() => {
    return (
        <Slider className="track-progress-bar"/>
    )
})