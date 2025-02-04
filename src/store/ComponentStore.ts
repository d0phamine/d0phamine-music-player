import { makeAutoObservable, runInAction } from "mobx"

import ColorThief from "colorthief"

export interface IDirDropdownItems {
	key: number
	label: string
}

export interface IComponentStore {
	browserSearchValue: string
	dirDropdownItems: IDirDropdownItems[]
	drawerOpen: boolean
	drawerContent: any | undefined
	childrenDrawer: boolean
	containerRefSize: { width: number; height: number }
	howlerRef: any
	BigPlayerOpen: boolean
	BigPlayerLyricsOpen: boolean
	BigPlayerCoverSize: string
	BigPlayerLyricsScrollState: HTMLDivElement | null
	BigPlayerCoverMainColor: [number, number, number] | undefined
	showAudioVisualization: boolean
}

export class ComponentStore {
	public componentData: IComponentStore = {
		browserSearchValue: "",
		dirDropdownItems: [{ key: 1, label: "Add folder to playlist" }],
		drawerOpen: false,
		childrenDrawer: false,
		containerRefSize: { width: 0, height: 0 },
		howlerRef: null,
		drawerContent: undefined,
		BigPlayerOpen: false,
		BigPlayerLyricsOpen: false,
		BigPlayerCoverSize: "360px",
		BigPlayerLyricsScrollState: null,
		BigPlayerCoverMainColor: undefined,
		showAudioVisualization: true,
	}

	constructor() {
		makeAutoObservable(this)
	}

	public getBrowserSearchValue(value: string) {
		this.componentData.browserSearchValue = value
	}

	public clearBrowserSearchValue() {
		this.componentData.browserSearchValue = ""
	}

	public changeDrawerOpen(content?: any) {
		if (this.componentData.drawerOpen) {
			this.componentData.drawerOpen = false
			this.componentData.drawerContent = undefined
		} else {
			this.componentData.drawerContent = content
			this.componentData.drawerOpen = true
		}
	}

	public changeChildrenDrawer() {
		this.componentData.childrenDrawer = !this.componentData.childrenDrawer
	}

	public setDrawerContainerRefSize(
		refElement: React.RefObject<HTMLDivElement>,
	) {
		if (refElement.current) {
			const { width, height } = refElement.current.getBoundingClientRect()
			this.componentData.containerRefSize = { width, height }
		}
	}

	public changeBigPlayerOpen() {
		this.componentData.BigPlayerOpen = !this.componentData.BigPlayerOpen
	}

	public setHowlerRef(ref: any) {
		this.componentData.howlerRef = ref
	}

	public changeBigPlayerLyricsOpen(set?: boolean) {
		if (set === true) {
			this.componentData.BigPlayerLyricsOpen = true
		}
		if (set === false) {
			this.componentData.BigPlayerLyricsOpen = false
		} else {
			this.componentData.BigPlayerLyricsOpen =
				!this.componentData.BigPlayerLyricsOpen
		}

		if (this.componentData.BigPlayerLyricsOpen) {
			this.componentData.BigPlayerCoverSize = "240px"
		} else {
			this.componentData.BigPlayerCoverSize = "360px"
		}
	}

	public setBigPlayerLyricsScrollState(state: HTMLDivElement | null) {
		this.componentData.BigPlayerLyricsScrollState = state
	}

	public setBigPlayerCoverMainColor(imageElement: HTMLImageElement | null) {
		const colorThief = new ColorThief()
		if (imageElement) {
			const color = colorThief.getColor(imageElement)
			runInAction(() => {
				this.componentData.BigPlayerCoverMainColor = color
			})
		} else {
			runInAction(() => {
				this.componentData.BigPlayerCoverMainColor = undefined
			})
		}
	}

	public setShowAudiovisualization() {
		if (localStorage.getItem("visualization")) {
			if (localStorage.getItem("visualization") === "true") {
				this.componentData.showAudioVisualization = true
			} else {
				this.componentData.showAudioVisualization = false
			}
		} else {
			this.componentData.showAudioVisualization = true
		}
	}

	public switchShowAudiovisualization() {
		this.componentData.showAudioVisualization =
			!this.componentData.showAudioVisualization
		localStorage.setItem(
			"visualization",
			`${this.componentData.showAudioVisualization}`,
		)
	}
}
