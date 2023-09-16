import React from "react";
import { Link } from "react-router-dom";

export default function AlbumListItem(props) {
    return (
        <li className="album-li">
            <div className="album-text">
                <h3>{props.name}</h3>
                <button className="btn show-songs-btn" data-album-tracks={props.id}>Show Tracks</button>
            </div>
            <button className="btn album-select-btn" data-album-id={props.id}>Select</button>
            <ol className="album-track-list hidden" data-track-list={props.id}>
                
            </ol>
        </li>
    )

}