import React from "react";
import Header from "../components/Header";

export default function RecentRewind() {
    return (
        <div>
            <Header />
            <main>
                <h1>Recent Rewind</h1>
                <section className="playlist-setup">
                    <h4>Select number of tracks</h4>
                    <div className="select-playlist-size-btns">
                        <button className="btn">10</button>
                        <button className="btn">30</button>
                        <button className="btn">50</button>
                        {/* <button className="btn">Custom</button> */}
                    </div>
                </section>
                
                <section classNameName="artist-albums-section">
                    <h4>Playlist Tracks</h4>
                    <ul className="item-list">
                        <li className="song-li">
                            <h3>Song Name</h3>
                            <p>Artist</p>
                        </li>
                        <li className="song-li">
                            <h3>Song Name</h3>
                            <p>Artist</p>
                        </li>
                        <li className="song-li">
                            <h3>Song Name</h3>
                            <p>Artist</p>
                        </li>
                    </ul>
                </section>
                <button className="btn">Create Playlist</button>
                <h3>[PLAYLIST NAME] created</h3>
                <button className="btn">Open Playlist in Spotify</button>
            </main>
        </div>
    )
}