import { FC } from "react"
import { observer } from "mobx-react-lite"
import { Drawer, Button } from "antd"
import { RiPlayListAddFill } from "react-icons/ri"

import { useStores } from "../../../store"

import "./index.scss"

export interface PlaylistDrawerProps {
	style?: {}
}

export const PlaylistDrawer: FC<PlaylistDrawerProps> = observer((props) => {
	const { ComponentStore } = useStores()
	return (
		<Drawer
			className="playlist-drawer"
			title="Playlists"
            closable={false}
			onClose={() => ComponentStore.changeDrawerOpen()}
			open={ComponentStore.componentData.drawerOpen}
			getContainer={false}
			style={props.style}
			extra={<Button size="small" icon={<RiPlayListAddFill onClick={() => ComponentStore.changeChildrenDrawer()}/>} />}
		>
			<p>Some contents...</p>
			<p>Some contents...</p>
			<p>Some contents...</p>
			<Drawer
                className="playlist-drawer__children"
				title="Create Playlist"
                style={props.style}
                closable={false}
				onClose={() => ComponentStore.changeChildrenDrawer()}
				open={ComponentStore.componentData.childrenDrawer}
			></Drawer>
		</Drawer>
	)
})

