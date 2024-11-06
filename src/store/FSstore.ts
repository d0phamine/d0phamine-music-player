import { makeAutoObservable, runInAction } from "mobx"
import { dirname, normalize } from "path"
import { channels } from "../shared/constants"
import { ITrack } from "./PlayerStore"
const { ipcRenderer } = window.require("electron")

export interface DirsArr {
	type: string
	name: string
	path: string
}

export interface IFSstore {
	dirs: DirsArr[] | ITrack[] | null
	browserDirs: DirsArr[] | ITrack[] | null
	filteredDirs: DirsArr[] | ITrack[] | null
	favoriteDirs: string[]
	homePath: string
	currentPath: string
	previousPath: string
	loading: boolean
	tracksFromFavoriteDir: DirsArr[] | ITrack[] | null
}

export class FSstore {
	public FSdata: IFSstore = {
		dirs: null,
		browserDirs: [],
		filteredDirs: null,
		favoriteDirs: [],
		homePath: "",
		currentPath: "",
		previousPath: "",
		loading: false,
		tracksFromFavoriteDir: []
	}

	constructor() {
		makeAutoObservable(this)
	}

	public getDirs(dir?: string): Promise<DirsArr[] | ITrack[]> {
		this.FSdata.loading = true
		return new Promise((resolve, reject) => {
			// let files: DirsArr[] | ITrack[] = []

			ipcRenderer.send(channels.GET_DIR, { dir })

			ipcRenderer.on(
				"directory-files",
				(
					event: any,
					receivedFiles: DirsArr[] | ITrack[],
					path: string,
				) => {
					runInAction(() => {
						this.getPath(path)
						this.FSdata.loading = false // Assuming getPath is defined
						resolve(receivedFiles) // Return receivedFiles to the caller
					})

					// Возвращаем files после получения данных
				},
			)

			ipcRenderer.on(
				"directory-error",
				(event: any, errorMessage: any) => {
					console.log(errorMessage)
					this.FSdata.loading = false
					reject(errorMessage) // Отклоняем промис в случае ошибки
				},
			)
		})
	}

	public async setBrowserDirs(dir?: string) {
		const files = await this.getDirs(dir ?? "") // Fetch the files
		runInAction(() => {
			this.FSdata.browserDirs = files
			this.FSdata.filteredDirs = null // Assign the fetched files to browserDirs
		})
	}

	public async setTracksFromFavoriteDir(dir:string){
		const files = await this.getDirs(dir ?? "")
		// files.forEach((elem, index) => {
			
		// })
		runInAction(() => {
			this.FSdata.tracksFromFavoriteDir = files
		})
	}

	public filterDirsByValue(value: string) {
		if (this.FSdata.browserDirs) {
			this.FSdata.filteredDirs = this.FSdata.browserDirs.filter(
				(item: DirsArr | ITrack) =>
					item.name.toLowerCase().includes(value.toLowerCase()),
			)
		} else {
			this.FSdata.filteredDirs = []
		}
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

