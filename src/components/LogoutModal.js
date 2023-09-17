import React from "react";
import { Link } from "react-router-dom";

export default function LogoutModal() {
    return (
        <div className="logout-modal hidden" id="logout-modal">
            <Link to="/">
                <button className="btn" id="user-logout-btn">Log out</button>
            </Link>
        </div>
    )
}