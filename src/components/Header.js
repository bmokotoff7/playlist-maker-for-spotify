import React from "react";
import { Link } from "react-router-dom";
import LogoutModal from "./LogoutModal";

export default function Header() {
    return (
        <header className="main-header">
            <Link to='/home'>
                <button className="header-btn" id="home-btn">
                    <i className="fa-solid fa-house"></i>                
                </button>
            </Link>
            <h1>Playlist Maker for Spotify</h1>
            <button className="header-btn" id="profile-btn">
                <i className="fa-regular fa-user" id="profile-btn"></i>
                <p id="profile-btn" data-display-name="">{localStorage.getItem('displayName')}</p>
            </button>
            <LogoutModal />
        </header>
    )
}