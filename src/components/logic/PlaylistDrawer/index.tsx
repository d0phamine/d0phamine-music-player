import { FC } from "react"
import { observer } from "mobx-react-lite"
import { Drawer } from "antd"

import "./index.scss"

export const PlaylistDrawer: FC = observer(() => {
	return (
		<Drawer
			className="playlist-drawer"
			title="Basic Drawer"
			// onClose={onClose}
			// open={open}
		>
			<p>Some contents...</p>
			<p>Some contents...</p>
			<p>Some contents...</p>
		</Drawer>
	)
})
