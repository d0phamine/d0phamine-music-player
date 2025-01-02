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

	useEffect(() => {
		// Проверяем, что howlerRef и его свойства существуют
		if (howlerRef?.current?.howler) {
			const howlerInstance = howlerRef.current.howler

			// Проверяем, что sounds[0] существует и содержит _node
			const soundNode = howlerInstance._sounds[0]?._node
			if (!soundNode) {
				return; // Прерываем выполнение, если звуковой узел не найден
			}

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
						volume: 1,
						audioCtx: soundNode.context, // передаем аудиоконтекст
					},
				)
			}

			// Подключаем звуковой узел Howler к анализатору, если analyzerRef и soundNode существуют
			if (howlerInstance && analyzerRef.current && soundNode) {
				try {
					analyzerRef.current.connectInput(soundNode)
				} catch (error) {
					console.error("Failed to connect input:", error)
				}
			}
		}
	}, [howlerRef, PlayerStore.playerData.selectedTrack]) // Инициализация анализатора только при смене трека

	// Рендерим визуализатор с плавным переходом для opacity
	return <div ref={visualizerRef} className="audio-visualizer" style={{ background: "transparent" }}></div>
})