import { FC, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "store"

import "./index.scss"

export const TrackLyrics: FC = observer(() => {
	const { TextylStore, PlayerStore, ThemeStore } = useStores()
	const prevSeekRef = useRef<number | null>(null)
	const activeLineRef = useRef<(HTMLDivElement | null)[]>([])
	const lyricsContainerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!TextylStore.textylData.lyricsLoading) {
			TextylStore.textylData.lyrics?.forEach((item) => {
				if (item.activeFlag) {
					const observer = new MutationObserver((mutations, obs) => {
						const element = activeLineRef.current[item.id]
						if (element) {
							element.scrollIntoView({
								behavior: "smooth",
								block: "center",
							})
							obs.disconnect()
						}
					})
					if (lyricsContainerRef.current) {
						observer.observe(lyricsContainerRef.current, {
							childList: true,
							subtree: true,
						})
					}
				}
			})
		}
	}, [TextylStore.textylData.lyricsLoading])

	useEffect(() => {
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
		<div className="track-lyrics" ref={lyricsContainerRef}>
			{TextylStore.textylData.lyricsAppear &&
				(TextylStore.textylData.lyricsLoading ? (
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
									filter: item.activeFlag
										? "unset"
										: "blur(3px)",
								}}
							>
								{item.lyrics}
							</p>
						</div>
					))
				))}
		</div>
	)
})

