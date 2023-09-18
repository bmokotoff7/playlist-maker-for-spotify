import React from "react";
import Header from "../components/Header";
import * as dataModule from '../data.js'

export default function OpenPlaylist(props) {
    console.log(props.data)
    return (
        <div>
            <Header />
            <main>
                <h1>Playlist Created</h1>
                <h3>{props.data}</h3>
                <a href={props.data} target='_blank'>
                    <button className="btn">Open Playlist in Spotify</button>
                </a>
            </main>
        </div>
    )
}