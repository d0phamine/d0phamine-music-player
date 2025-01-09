import { createContext, useContext } from "react"
import { FSstore } from "./FSstore"
import { ComponentStore } from "./ComponentStore"
import { PlayerStore } from "./PlayerStore"
import { SpotifyStore } from "./SpotifyStore"
import { ThemeStore } from "./ThemeStore"
import { GeniusStore } from "./GeniusStore"


export const rootStoreContext = createContext({
	FSstore: new FSstore(),
	ComponentStore: new ComponentStore(),
	PlayerStore: new PlayerStore(),
	SpotifyStore: new SpotifyStore(),
	ThemeStore: new ThemeStore(),
	GeniusStore: new GeniusStore(),
})

export const useStores = () => useContext(rootStoreContext)
