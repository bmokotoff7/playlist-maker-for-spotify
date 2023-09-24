import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
    return (
        <main className="login-page">
            <span className="login-logo">PM</span>
            <h2>Welcome to Playlist Maker for Spotify</h2>
            <Link to="/home">
                <button className="btn" id="spotify-login-btn">Login with Spotify</button>
            </Link>
        </main>
    )
}