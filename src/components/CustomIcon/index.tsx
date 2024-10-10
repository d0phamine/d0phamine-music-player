import { FC, ReactNode } from "react";

import "./index.scss";

export interface CustomIconProps {
	children: ReactNode;
    onClick: () => void
}

export const CustomIcon: FC<CustomIconProps> = (props) => {
	return <div className={"custom-icon"} onClick={props.onClick}>{props.children}</div>;
};

