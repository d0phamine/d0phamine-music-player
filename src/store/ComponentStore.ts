import { makeAutoObservable } from "mobx"

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
    howlerRef:any
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

	public changeDrawerOpen(content?:any) {
		if (this.componentData.drawerOpen) {
			this.componentData.drawerOpen = false
			this.componentData.drawerContent = undefined
		} else {
			this.componentData.drawerContent = content
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

	public setDrawerContainerRefSize(refElement: React.RefObject<HTMLDivElement>) {
		if (refElement.current) {
			const { width, height } = refElement.current.getBoundingClientRect()
			this.componentData.containerRefSize = { width, height }
		}
	}
	

    public setHowlerRef(ref:any){
        this.componentData.howlerRef = ref
    }


}

