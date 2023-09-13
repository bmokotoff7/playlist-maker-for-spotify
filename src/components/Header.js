import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <Link to='/home'>
                <button className="btn" id="home-btn">Home</button>
            </Link>
            <h1>Playlist Maker for Spotify</h1>
            <Link to="/">
                <button className="btn" id="user-logout-btn">Log Out</button>
            </Link>
        </header>
    )
}