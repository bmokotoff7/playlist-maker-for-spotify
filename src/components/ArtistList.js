import React from "react";
import ArtistListItem from "./ArtistListItem";

export default function ArtistList(props) {
    const data = props.data ? props.data : null
    if (data) {
        return (
            <div>
                {/* <h4>Search Results</h4> */}
                <ul className="item-list">
                    {data && data.map(artist => {
                        return <ArtistListItem name={artist.name} id={artist.id} imageUrl={artist.imageUrl}/>
                    })}
                </ul>
            </div>
        )
    }
}