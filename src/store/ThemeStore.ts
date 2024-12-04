import { makeAutoObservable, runInAction } from "mobx"
import { theme } from "antd"

export interface Theme {
	backgroundColor: string
	primaryColor: string
	borderColor: string
    fontColor: string
    algorithm: any
}

export class ThemeStore {
	public PrimaryColor: string = "#6f56d0"

	public DarkTheme: Theme = {
		primaryColor: this.PrimaryColor,
        algorithm: theme.darkAlgorithm,
		backgroundColor: "#141414",
        borderColor: "#424242",
        fontColor: "#ffffff",
        
	}

	public LightTheme: Theme = {
		primaryColor: this.PrimaryColor,
        algorithm: theme.defaultAlgorithm,
		backgroundColor: "#ebebeb",
        borderColor: "#d9d9d9",
        fontColor: "#000000",
	}

	public CurrentTheme: Theme = this.LightTheme
}
