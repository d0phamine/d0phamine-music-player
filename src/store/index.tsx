import { createContext, useContext } from "react"
import { FSstore } from "./FSstore"
import { ComponentStore } from "./ComponentStore"

export const rootStoreContext = createContext({
	FSstore: new FSstore(),
	ComponentStore: new ComponentStore(),
})

export const useStores = () => useContext(rootStoreContext)
