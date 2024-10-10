import { createContext, useContext } from "react";
import { FSstore } from "./FSstore";

export const rootStoreContext = createContext({
    FSstore: new FSstore(),
})

export const useStores = () => useContext(rootStoreContext)