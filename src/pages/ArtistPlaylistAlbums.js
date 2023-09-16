import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import AlbumList from "../components/AlbumList";
import * as dataModule from '../data.js'

export default function ArtistPlaylistAlbums(props) {
    return (
        <div>
            <Header />
            <main>
                <h1>Create Artist Playlist</h1>
                <Link to='/artistplaylist'>
                    <button className="btn">Back to Search Results</button>
                </Link>
                <section className="artist-albums-section">
                    <h4>{dataModule.getSelectedArtistName()} Albums</h4>
                    <AlbumList data={props.data}/>
                    <h4>X Albums Selected</h4>
                </section>
                <button className="btn" id="ap-playlist-create-btn">Create Playlist</button>
                <h3>[PLAYLIST NAME] created</h3>
                <button className="btn">Open Playlist in Spotify</button>
            </main>
        </div>
    )
}