import { makeAutoObservable } from "mobx";
import { dirname, normalize } from "path";

export interface IFSstore {
	dirs: [] | null;
	favoriteDirs: string[];
	homePath: string;
	currentPath: string;
	previousPath: string;
}

export class FSstore {
	public FSdata: IFSstore = {
		dirs: null,
		favoriteDirs: [],
		homePath: "",
		currentPath: "",
		previousPath: "",
	};

	constructor() {
		makeAutoObservable(this);
	}

	public getCatalogue(dirs: []) {
		this.FSdata.dirs = dirs;
	}

	public getPath(path: string) {
		if (this.FSdata.homePath) {
			this.FSdata.currentPath = path;
			this.FSdata.previousPath = dirname(this.FSdata.currentPath);
			this.FSdata.previousPath = normalize(this.FSdata.previousPath);
		} else {
			this.FSdata.homePath = path;
			this.FSdata.currentPath = path;
		}
	}

	public getFavoriteDirs(dirs:any){
		this.FSdata.favoriteDirs = dirs
	}

    public addToFavoriteDirs(path:string) {
        this.FSdata.favoriteDirs.push(path)
        console.log(this.FSdata.favoriteDirs)
    }
}

