import React from "react";

export default function Header() {
    return (
        <header>
            <a href="/home">
                <button className="btn" id="home-btn">Home</button>
            </a>
            <h1>Playlist Maker for Spotify</h1>
            <a href="/">
                <button className="btn" id="user-logout-btn">Log Out</button>
            </a>
        </header>
    )
}