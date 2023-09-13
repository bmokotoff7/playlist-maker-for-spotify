import React from "react";
import AlbumListItem from "./AlbumListItem";

export default function AlbumList(props) {
    const data = props.data ? props.data : null
    if (data) {
        return (
            <ul className="item-list">
                {data && data.map(album => {
                    return <AlbumListItem name={album.name} />
                })}
            </ul>
        )
    }
}