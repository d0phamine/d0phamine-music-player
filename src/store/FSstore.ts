import { makeAutoObservable, runInAction } from "mobx"
import { dirname, normalize } from "path"
import { channels } from "../shared/constants"
const { ipcRenderer } = window.require("electron")

export interface IFSstore {
	dirs: [] | null | never[]
	filteredDirs: [] | null | never[]
	favoriteDirs: string[]
	homePath: string
	currentPath: string
	previousPath: string
	favoriteHandler: boolean
}

export class FSstore {
	public FSdata: IFSstore = {
		dirs: null,
		filteredDirs: null,
		favoriteDirs: [],
		homePath: "",
		currentPath: "",
		previousPath: "",
		favoriteHandler: false,
	}

	constructor() {
		makeAutoObservable(this)
	}

	public getDirs(dir?: string) {
		// this.FSdata.dirs = dirs;
		ipcRenderer.send(channels.GET_DIR, { dir })
		ipcRenderer.on(
			"directory-files",
			(event: any, receivedFiles: [], path: string) => {
				// Обновляем состояние при получении файлов
				runInAction(() => {
					this.FSdata.dirs = receivedFiles
					this.getPath(path)
				})
			},
		)
		ipcRenderer.on("directory-error", (event: any, errorMessage: any) => {
			console.log(errorMessage)
		})

		return () => {
			ipcRenderer.removeAllListeners("directory-files")
			ipcRenderer.removeAllListeners("directory-error")
		}
	}

	public filterDirsByValue(value: string) {
		this.FSdata.filteredDirs = this.FSdata.dirs
			? this.FSdata.dirs.filter((item: { name: string, path:string, type:string }) =>
					item.name.toLowerCase().includes(value.toLowerCase()),
			  )
			: []
	}

	public clearFilteredDirs(){
		this.FSdata.filteredDirs = null
	}

	public getPath(path: string) {
		if (this.FSdata.homePath) {
			this.FSdata.currentPath = path
			this.FSdata.previousPath = dirname(this.FSdata.currentPath)
			this.FSdata.previousPath = normalize(this.FSdata.previousPath)
		} else {
			this.FSdata.homePath = path
			this.FSdata.currentPath = path
		}
	}

	public getFavoriteDirs() {
		ipcRenderer.send(channels.GET_FAVORITES)
		ipcRenderer.on("get-favorites", (event: any, favoriteDirs: any) => {
			runInAction(() => {
				this.FSdata.favoriteDirs = favoriteDirs
			})
		})
		return () => {
			ipcRenderer.removeAllListeners("get-favorites")
		}
	}

	public addToFavoriteDirs(path: string) {
		ipcRenderer.send(channels.ADD_FAVORITE, path)
		this.getFavoriteDirs()
	}

	public deletFromFavorites(path: string) {
		ipcRenderer.send(channels.DELETE_FAVORITE, path)
		this.getFavoriteDirs()
	}
}

