import { FC } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages/mainPage";

export const Router: FC = () => {
	return (
		<HashRouter>
			<Routes>
				<Route path="/">
					<Route index element={<IndexPage />} />
				</Route>
			</Routes>
		</HashRouter>
	);
};
