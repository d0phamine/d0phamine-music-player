import { makeAutoObservable, runInAction } from "mobx"

export interface Theme {
	name: string
	backgroundColor: string
	primaryColor: string
	borderColor: string
	fontColor: string
	playingTrackColor: string
	disabledColor: string
}

export class ThemeStore {
	public PrimaryColor: string = "#6f56d0"

	public DarkTheme: Theme = {
		name: "DarkTheme",
		primaryColor: this.PrimaryColor,
		backgroundColor: "#141414",
		borderColor: "#424242",
		fontColor: "#ffffff",
		playingTrackColor: "#1cc75b",
		disabledColor: "rgba(184,184,184, 0.6)",
	}

	public LightTheme: Theme = {
		name: "LightTheme",
		primaryColor: this.PrimaryColor,
		backgroundColor: "#fafafa",
		borderColor: "#d9d9d9",
		fontColor: "#202020",
		playingTrackColor: "#1cc75b",
		disabledColor: "rgba(100,100,100, 0.6)",
	}

	public CurrentTheme: Theme = { ...this.LightTheme }

	constructor() {
		makeAutoObservable(this)
	}

	public setTheme() {
		if (localStorage.getItem("theme")) {
			if (localStorage.getItem("theme") === this.DarkTheme.name) {
				this.CurrentTheme = this.DarkTheme
			} else {
				this.CurrentTheme = this.LightTheme
			}
		} else {
            this.CurrentTheme = this.LightTheme
        }
	}

	public switchTheme() {
		if (this.CurrentTheme.name === this.LightTheme.name) {
			runInAction(() => {
				this.CurrentTheme = this.DarkTheme
			})
			localStorage.setItem("theme", this.CurrentTheme.name)
		} else {
			runInAction(() => {
				this.CurrentTheme = this.LightTheme
			})
			localStorage.setItem("theme", this.CurrentTheme.name)
		}
	}
}

