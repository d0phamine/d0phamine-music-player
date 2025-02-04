import { FC } from "react"

import { MdLyrics } from "react-icons/md"

import { useStores } from "store"

import "./index.scss"

export const LyricsIcon: FC = () => {
	const { ComponentStore, ThemeStore, TextylStore } = useStores()

	const getStyle = (
		isActive: boolean,
		isDisabled: boolean,
		fontSize: string,
	) => ({
		cursor: isDisabled ? "unset" : "pointer",
		fontSize,
		color: isActive
			? ThemeStore.CurrentTheme.primaryColor
			: isDisabled
				? ThemeStore.CurrentTheme.disabledColor
				: ThemeStore.CurrentTheme.fontColor,
	})

	return (
		<MdLyrics
			className="lyrics-icon"
			style={getStyle(
				ComponentStore.componentData.BigPlayerLyricsOpen,
				!TextylStore.textylData.lyrics,
				"24px",
			)}
			onClick={() => {
				if (TextylStore.textylData.lyrics) {
					ComponentStore.changeBigPlayerLyricsOpen()
				}
			}}
		/>
	)
}
