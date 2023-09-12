import React from "react";
import Header from "../components/Header";

export default function ArtistPlaylist() {
    return (
        <div>
            <Header />
            <main>
                <h1>Create Artist Playlist</h1>
                <section className="search-box-section">
                    <input className="search-box" type="text" placeholder="Search for an artist..." />
                    <button className="btn search-btn">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </section>
                <section className="search-results-section">
                    <h4>Search Results</h4>
                    <ul className="item-list">
                        <li className="artist-li">
                            <h3>Artist Name 1</h3>
                        </li>
                        <li className="artist-li">
                            <h3>Artist Name 2</h3>
                        </li>
                        <li className="artist-li">
                            <h3>Artist Name 3</h3>
                        </li>
                    </ul>
                </section>
                <section className="artist-albums-section">
                    <h4>[ARTIST] Albums</h4>
                    <ul className="item-list">
                        <li className="album-li">
                            <div>
                                <h3>Album Name 1</h3>
                                <button className="btn album-li-btn show-songs-btn">Show Songs</button>
                            </div>
                            <div className="album-li-btns">
                                <button className="btn album-li-btn">Select Album</button>
                            </div>
                        </li>
                        <li className="album-li">
                            <div>
                                <h3>Album Name 2</h3>
                                <button className="btn album-li-btn show-songs-btn">Show Songs</button>
                            </div>
                            <div className="album-li-btns">
                                <button className="btn album-li-btn">Select Album</button>
                            </div>
                        </li>
                        <li className="album-li">
                            <div>
                                <h3>Album Name 3</h3>
                                <button className="btn album-li-btn show-songs-btn">Show Songs</button>
                            </div>
                            <div className="album-li-btns">
                                <button className="btn album-li-btn">Select Album</button>
                            </div>
                        </li>
                    </ul>
                    <h4>X Albums Selected</h4>
                </section>
                <button className="btn">Create Playlist</button>
                <h3>[PLAYLIST NAME] created</h3>
                <button className="btn">Open Playlist in Spotify</button>
            </main>
        </div>
    )
}