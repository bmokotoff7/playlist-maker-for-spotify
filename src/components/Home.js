import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main>
            <section className="homepage-btns">
                <Link to='/artistplaylist'>
                    <button className="btn" id="create-artist-playlist-btn">Create Artist Playlist</button>
                </Link>
                <Link to='/recentrewind'>
                    <button className="btn" id="recent-rewind-btn">Get My Recent Rewind</button>
                </Link>
                <Link to='/favorites'>
                    <button className="btn" id="favorites-btn">Get My All Time Favorites</button>
                </Link>
            </section>
        </main>
    )
}