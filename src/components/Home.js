import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main>
            <section className="homepage-btns-container">
                <div className="homepage-btn">
                    <h2>Artist Playlist</h2>
                    <p>Create a playlist from an artist's music library</p>
                    <Link to='/artistplaylist'>
                        <button className="btn" id="create-artist-playlist-btn">Create Artist Playlist</button>
                    </Link>
                </div>
                <div className="homepage-btn">
                    <h2>Recent Rewind</h2>
                    <p>Create a playlist with your top 30 tracks from the past month</p>
                    <Link to='/recentrewind'>
                        <button className="btn" id="recent-rewind-btn">Get My Recent Rewind</button>
                    </Link>
                </div>
                <div className="homepage-btn">
                    <h2>All Time Favorites</h2>
                    <p>Create a playlist with your top 50 tracks of all time</p>
                    <Link to='/favorites'>
                        <button className="btn" id="favorites-btn">Get My All Time Favorites</button>
                    </Link>
                </div>
            </section>
        </main>
    )
}