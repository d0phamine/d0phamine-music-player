import { FC, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "store"
import { motion } from "motion/react"

import "./index.scss"

export const TrackLyrics: FC = observer(() => {
	const { TextylStore, PlayerStore, ThemeStore } = useStores()
	const prevSeekRef = useRef<number | null>(null)
	const activeLineRef = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		// TextylStore.textylData.lyrics?.forEach((item) => {
		//     if (item.seconds === PlayerStore.playerData.currentTimeOfPlay) {
		//         item.activeFlag = true
		//     }
		// })
		const currentSeek = Math.floor(
			PlayerStore.playerData.currentSeekOfPlay || 0,
		)
		if (prevSeekRef.current !== currentSeek) {
			prevSeekRef.current = currentSeek

			TextylStore.textylData.lyrics?.forEach((item) => {
				if (item.seconds === prevSeekRef.current) {
					TextylStore.setLyricsLineActive(item.id)
					activeLineRef.current[item.id]?.scrollIntoView({
						behavior: "smooth",
						block: "center",
					})
				}
			})
		}
	}, [PlayerStore.playerData.currentSeekOfPlay])

	return (
		<div className="track-lyrics">
			{TextylStore.textylData.lyricsOpen && (
				TextylStore.textylData.lyricsLoading ? (
					<div>Loading...</div>
				) : (
					TextylStore.textylData.lyrics?.map((item, index) => (
						<div
							key={index}
							className="track-lyrics__line"
							ref={(el) => (activeLineRef.current[index] = el)}
						>
							<p
								style={{
									color: item.activeFlag
										? ThemeStore.CurrentTheme.fontColor
										: ThemeStore.CurrentTheme.disabledColor,
								}}
							>
								{item.lyrics}
							</p>
						</div>
					))
				)
			)}
		</div>
	)
})

