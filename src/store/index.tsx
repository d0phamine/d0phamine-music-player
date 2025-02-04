import { createContext, useContext } from "react"

import { ComponentStore } from "./ComponentStore"
import { FSstore } from "./FSstore"
import { GeniusStore } from "./GeniusStore"
import { PlayerStore } from "./PlayerStore"
import { SpotifyStore } from "./SpotifyStore"
import { TextylStore } from "./TextylStore"
import { ThemeStore } from "./ThemeStore"

export const rootStoreContext = createContext({
	FSstore: new FSstore(),
	ComponentStore: new ComponentStore(),
	PlayerStore: new PlayerStore(),
	SpotifyStore: new SpotifyStore(),
	ThemeStore: new ThemeStore(),
	GeniusStore: new GeniusStore(),
	TextylStore: new TextylStore(),
})

export const useStores = () => useContext(rootStoreContext)
