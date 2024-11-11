import React, { useRef, useEffect, FC } from "react"
import AudioMotionAnalyzer from "audiomotion-analyzer"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../store"

import "./index.scss"

export interface AudioVisualizerProps {}

export const AudioVisualizer: FC<AudioVisualizerProps> = observer(() => {
	const { ComponentStore, PlayerStore } = useStores()
	const howlerRef = ComponentStore.componentData.howlerRef
	const analyzerRef = useRef<AudioMotionAnalyzer | null>(null)
	const visualizerRef = useRef<HTMLDivElement>(null)

	// Состояние для плавного затухания

	useEffect(() => {
		// Следим за состоянием воспроизведения

		// Проверяем, существует ли howlerRef и что внутри него есть howler
		if (howlerRef?.current?.howler) {
			const howlerInstance = howlerRef.current.howler

			// Инициализация AudioMotionAnalyzer только один раз
			if (visualizerRef.current && !analyzerRef.current) {
				analyzerRef.current = new AudioMotionAnalyzer(
					visualizerRef.current,
					{
						barSpace: 0.5,
						radial: true,
                        spinSpeed: 0.7,
                        radius: 0.1,
						channelLayout: "dual-horizontal",
                        showBgColor: true,
                        bgAlpha: 0,
                        overlay: true,
						fftSize: 16384,
                        showPeaks: true,
						showScaleX: false,
						showScaleY: false,
						gradient: "rainbow",
                        volume: 0,
						audioCtx: howlerInstance._sounds[0]._node.context, // передаем аудиоконтекст
					},
				)
			}

			// Подключаем звуковой узел Howler к анализатору
			if (howlerInstance && analyzerRef.current) {
				analyzerRef.current.connectInput(
					howlerInstance._sounds[0]._node,
				)
			}
		}
	}, [howlerRef, PlayerStore.playerData.selectedTrack]) // Инициализация анализатора только при смене трека

	// Рендерим визуализатор с плавным переходом для opacity
	return <div ref={visualizerRef} className="audio-visualizer" style={{background:"transparent"}}></div>
})

