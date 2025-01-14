import { makeAutoObservable, runInAction } from "mobx"
import { dirname, normalize } from "path"
import { channels } from "shared/constants"
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
	favoriteDirs: DirsArr[] | ITrack[]
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

	public async getDirs(dir?: string): Promise<DirsArr[] | ITrack[]> {
		this.FSdata.loading = true;
		try {
			const { receivedFiles, path } = await ipcRenderer.invoke(channels.GET_DIR, { dir });
			runInAction(() => {
				this.getPath(path);
				this.FSdata.loading = false;
			});
			return receivedFiles;
		} catch (errorMessage) {
			runInAction(() => {
				this.FSdata.loading = false;
			});
			throw errorMessage;
		}
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

	public async getFavoriteDirs() {
		try {
			const favoriteDirs = await ipcRenderer.invoke(channels.GET_FAVORITES);
			runInAction(() => {
				this.FSdata.favoriteDirs = favoriteDirs;
			});
		} catch (error) {
			console.error("Error fetching favorite directories:", error);
		}
	}

	public async addToFavoriteDirs(path: string) {
		try {
			await ipcRenderer.invoke(channels.ADD_FAVORITE, path);
			await this.getFavoriteDirs();
		} catch (error) {
			console.error("Error adding to favorite directories:", error);
		}
	}

	public async deleteFromFavorites(path: string) {
		try {
			await ipcRenderer.invoke(channels.DELETE_FAVORITE, path);
			await this.getFavoriteDirs();
		} catch (error) {
			console.error("Error deleting from favorite directories:", error);
		}
	}
}

