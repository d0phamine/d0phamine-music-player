import { log } from "console";
import { makeAutoObservable } from "mobx";
import { dirname, normalize } from "path";

export interface IFSstore {
	dirs: [] | null;
	homePath: string;
	currentPath: string;
	previousPath: string;
}

export class FSstore {
	public FSdata: IFSstore = {
		dirs: null,
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
}

