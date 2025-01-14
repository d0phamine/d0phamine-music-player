import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "store"

import "./index.scss"

export const TrackLyrics: FC = observer(() => {
const { PlayerStore } = useStores()

    return (
        <div className="track-lyrics"></div>
    )
})