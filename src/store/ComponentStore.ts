import { makeAutoObservable } from "mobx"

export interface IDirDropdownItems {
	key: number
	label: string
}

export interface IComponentStore {
	browserSearchValue: string
	dirDropdownItems: IDirDropdownItems[]
	drawerOpen: boolean
	childrenDrawer: boolean
	containerRefSize: { width: number; height: number }
}

export class ComponentStore {
	public componentData: IComponentStore = {
		browserSearchValue: "",
		dirDropdownItems: [{ key: 1, label: "Add folder to playlist" }],
		drawerOpen: false,
		childrenDrawer: false,
		containerRefSize: { width: 0, height: 0 },
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

	public changeDrawerOpen() {
		if (this.componentData.drawerOpen) {
			this.componentData.drawerOpen = false
		} else {
			this.componentData.drawerOpen = true
		}
	}

	public changeChildrenDrawer() {
		if (this.componentData.childrenDrawer) {
			this.componentData.childrenDrawer = false
		} else {
			this.componentData.childrenDrawer = true
		}
	}

	public setContainerRefSize(refElement: React.RefObject<HTMLDivElement>) {
		if (refElement.current) {
			const { width, height } = refElement.current.getBoundingClientRect()
			this.componentData.containerRefSize = { width, height }
		}
	}
}

