// Track list for recent rewind and favorites
import React from "react";
import TrackListItem from "./TrackListItem";

export default function TrackList(props) {
    const data = props.data ? props.data : null
    if (data) {
        console.log(data)
        return (
            <ol className="ol-item-list track-list">
                {data && data.map(track => {
                    const artists = track.artists.map(function(artist) {
                        return artist.name
                    }).join(', ')
                    console.log(artists)
                    return <TrackListItem name={track.name} artist={artists} />
                })}
            </ol>
        )
    }
}