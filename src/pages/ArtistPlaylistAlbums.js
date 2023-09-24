import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import AlbumList from "../components/AlbumList";
import * as dataModule from '../data.js'

export default function ArtistPlaylistAlbums(props) {
    console.log(props.link)
    return (
        <div>
            <Header />
            <main>
                {/* <h1>Create Artist Playlist</h1> */}
                <Link to='/artistplaylist' id="back-btn">
                    <button className="btn back-btn">⬅ Back</button>
                </Link>
                <section className="artist-albums-section" id="album-list-section">
                    <h3>{dataModule.getSelectedArtistName()} Albums</h3>
                    <button className="btn select-all-btn" id="select-all-btn">Select All Albums</button>
                    <AlbumList data={props.data}/>
                </section>
                <button className="btn" id="ap-playlist-create-btn">Create Playlist</button>
                <h3 id="playlist-created-text" className="hidden">Playlist created</h3>
                <a href={props.link} target='_blank' id="open-playlist-btn" className="hidden">
                    <button className="btn">Open Playlist in Spotify</button>
                </a>
            </main>
        </div>
    )
}