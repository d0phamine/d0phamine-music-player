import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { ConfigProvider, theme } from "antd";
import { Titlebar } from "./components/Titlebar";

import "react-toastify/dist/ReactToastify.css";
import "./styles/index.scss";
import "./styles/tailwind.css";
import "./styles/titlebar.css";

import { Router } from "./router";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
				token: {
					// Seed Token
					colorPrimary: "#6f56d0",
				},
			}}
		>
			<ToastContainer position="top-right" autoClose={2500} />
			<Titlebar />
			<Router />
		</ConfigProvider>
	</React.StrictMode>,
);
