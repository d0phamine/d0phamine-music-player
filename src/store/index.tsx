import { createContext, useContext } from "react"
import { FSstore } from "./FSstore"
import { ComponentStore } from "./ComponentStore"
import { PlayerStore } from "./PlayerStore"

export const rootStoreContext = createContext({
	FSstore: new FSstore(),
	ComponentStore: new ComponentStore(),
	PlayerStore: new PlayerStore()
})

export const useStores = () => useContext(rootStoreContext)
