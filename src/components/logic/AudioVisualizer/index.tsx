import { useRef, useEffect, FC } from "react"
import AudioMotionAnalyzer from "audiomotion-analyzer"
import { observer } from "mobx-react-lite"
import { useStores } from "store"

import "./index.scss"

export interface AudioVisualizerProps {}

export const AudioVisualizer: FC<AudioVisualizerProps> = observer(() => {
	const { ComponentStore } = useStores()
	const howlerRef = ComponentStore.componentData.howlerRef
	const analyzerRef = useRef<AudioMotionAnalyzer | null>(null)
	const visualizerRef = useRef<HTMLDivElement>(null)
	const previousSoundNodeRef = useRef<AudioNode | null>(null)

	useEffect(() => {
		// Проверяем, что howlerRef и его свойства существуют
		if (howlerRef?.current?.howler) {
			const howlerInstance = howlerRef.current.howler

			// Проверяем, что sounds[0] существует и содержит _node
			const soundNode = howlerInstance._sounds[0]?._node
			if (!soundNode) {
				return // Прерываем выполнение, если звуковой узел не найден
			}
			console.log(visualizerRef.current, "visualizerRef.current")
			console.log(analyzerRef.current, "analyzerRef.current")
			// Инициализация AudioMotionAnalyzer только один раз
			if (visualizerRef.current && !analyzerRef.current) {
				console.log("new example")
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
						audioCtx: soundNode.context,
					},
				)
			}

			// Отключаем предыдущий звуковой узел, если он существует
			if (previousSoundNodeRef.current && analyzerRef.current) {
				console.log("disable")
				analyzerRef.current.disconnectInput(
					previousSoundNodeRef.current,
				)
			}

			// Подключаем звуковой узел Howler к анализатору, если analyzerRef и soundNode существуют
			if (howlerInstance && analyzerRef.current && soundNode) {
				try {
					analyzerRef.current.connectInput(soundNode)
					previousSoundNodeRef.current = soundNode // Сохраняем текущий звуковой узел
				} catch (error) {
					console.error(error)
				}
			}

			if (analyzerRef.current) {
				if (ComponentStore.componentData.showAudioVisualization) {
					analyzerRef.current.useCanvas = true
				} else {
					analyzerRef.current.useCanvas = false
				}
			}
		}
	}, [howlerRef, ComponentStore.componentData.showAudioVisualization])

	return (
		<div
			ref={visualizerRef}
			className="audio-visualizer"
			style={{ background: "transparent" }}
		></div>
	)
})

