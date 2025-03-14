import React from "react"

import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Titlebar } from "./components"
import { Router } from "./router"
import "./styles/global.scss"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
	<React.StrictMode>
		<HashRouter>
			<ToastContainer position="top-right" autoClose={2500} />
			<Titlebar />
			<Router />
		</HashRouter>
	</React.StrictMode>,
)
