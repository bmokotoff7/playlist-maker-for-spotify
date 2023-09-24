import React from "react";
import { Link } from "react-router-dom";

export default function LogoutModal() {
    return (
        <div className="logout-modal hidden" id="logout-modal">
            <p className="modal-username" id="profile-btn" data-display-name="">{localStorage.getItem('displayName')}</p>
            <Link to="/">
                <button className="btn logout-btn" id="user-logout-btn">Log out</button>
            </Link>
        </div>
    )
}