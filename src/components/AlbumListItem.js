import React from "react";
import { Link } from "react-router-dom";

export default function AlbumListItem(props) {
    return (
        <li className="album-li">
            <div>
                <h3>{props.name}</h3>
                <button className="btn album-li-btn show-songs-btn">Show Songs</button>
            </div>
            <div className="album-li-btns">
                <button className="btn album-li-btn">Select Album</button>
            </div>
        </li>
    )
}