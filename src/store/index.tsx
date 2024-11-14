import { createContext, useContext } from "react"
import { FSstore } from "./FSstore"
import { ComponentStore } from "./ComponentStore"
import { PlayerStore } from "./PlayerStore"
import { SpotifyStore } from "./SpotifyStore"

export const rootStoreContext = createContext({
	FSstore: new FSstore(),
	ComponentStore: new ComponentStore(),
	PlayerStore: new PlayerStore(),
	SpotifyStore: new SpotifyStore()
})

export const useStores = () => useContext(rootStoreContext)
