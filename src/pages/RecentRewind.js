import React from "react";
import Header from "../components/Header";
import TrackList from "../components/TrackList";
import { Link } from "react-router-dom";

export default function RecentRewind(props) {
    return (
        <div>
            <Header />
            <main>
                <h1 className="page-heading" id="rr-heading">Recent Rewind</h1>
                {/* <section className="playlist-setup"> */}
                    {/* <h4>Select number of tracks</h4> */}
                    {/* <div className="select-playlist-size-btns"> */}
                        {/* <button className="btn">10</button> */}
                        {/* <button className="btn">30</button> */}
                        {/* <button className="btn">50</button> */}
                        {/* <button className="btn">Custom</button> */}
                    {/* </div> */}
                {/* </section> */}
                
                <section className="artist-albums-section" id="rr-tracks-section">
                    <h4 className="list-title">Playlist Tracks</h4>
                    <TrackList data={props.data} />
                </section>
                <button className="btn" id="rr-playlist-create-btn">Create Playlist</button>
                <h3 id="playlist-created-text" className="hidden">Playlist created</h3>
                <a href={props.link} target='_blank' id="open-playlist-btn" className="hidden">
                    <button className="btn">Open Playlist in Spotify</button>
                </a>
            </main>
        </div>
    )
}