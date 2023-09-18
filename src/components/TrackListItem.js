import React from "react";

export default function TrackListItem(props) {
    return (
        <li className="track-li">
            <h3>{props.name}</h3>
            <p>{props.artist}</p>
        </li>
    )

}