import React from "react";
import Header from "../components/Header";
import ArtistList from "../components/ArtistList";

export default function ArtistPlaylist(props) {
    return (
        <div>
            <Header />
            <main>
                <h1>Create Artist Playlist</h1>
                <section className="search-box-section">
                    <input className="search-box" type="text" id="artist-playlist-search-terms" placeholder="Search for an artist..." />
                    <button className="btn search-btn" id="artist-search-btn">
                        <i className="fa-solid fa-magnifying-glass" id="artist-search-btn"></i>
                    </button>
                </section>
                <section className="search-results-section">
                    <ArtistList 
                        data={props.data}
                    />
                </section>
            </main>
        </div>
    )
}