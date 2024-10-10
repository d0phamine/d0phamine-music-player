import { FC, ReactNode } from "react";

import './index.scss'

export interface CustomListItemProps {
    title?:string | null,
    button?:ReactNode | null,
    control?:ReactNode | null,
    style?:object,
    onClick?: () => void,
    customClass?: string,
} 

export const CustomListItem:FC<CustomListItemProps> = (props) => {
    return (
        <div className={"custom-list-item" + " " + props.customClass} style={props.style}>
            <div className="custom-list-item__button">
                {props.button}
            </div>
            <div className="custom-list-item__title" onClick={props.onClick}>
                <p>{props.title}</p>
            </div>
            <div className="custom-list-item__control">
                {props.control}
            </div>
        </div>
    )
}