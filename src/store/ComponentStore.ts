import { makeAutoObservable } from "mobx"

export interface IDirDropdownItems {
    key:number
    label: string
}

export interface IComponentStore {
    browserSearchValue: string
    dirDropdownItems: IDirDropdownItems[]

}

export class ComponentStore {
    public componentData: IComponentStore = {
        browserSearchValue: "",
        dirDropdownItems: [{key: 1, label:"Add folder to playlist"}]
    }

    constructor() {
        makeAutoObservable(this)
    }

    public getBrowserSearchValue(value:string) {
        this.componentData.browserSearchValue = value
    }

    public clearBrowserSearchValue(){
        this.componentData.browserSearchValue = ""
    }
}