import { makeAutoObservable } from "mobx"

export interface IComponentStore {
    browserSearchValue: string
}

export class ComponentStore {
    public componentData = {
        browserSearchValue: "",
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