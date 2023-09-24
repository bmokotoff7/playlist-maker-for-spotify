import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
    return (
        <main className="login-page">
            <h2>Welcome to Playlist Maker for Spotify</h2>
            <Link to="/home">
                <button className="btn" id="spotify-login-btn">Login with Spotify</button>
            </Link>
            <section className="video-section">
                <p>Note: This app is still under development and is only available to select Spotify users at this time.</p>
                
            </section>
        </main>
    )
}