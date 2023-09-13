import React from "react";
import { Link } from "react-router-dom";
import Icon from '../images/login-background.jpg'

export default function ArtistListItem(props) {
    return (
        <li data-artist-id={props.id}>
            <Link to='/artistplaylistalbums' className="artist-li" data-artist-id={props.id}>
                <img src={props.imageUrl ? props.imageUrl : null} className="artist-img" data-artist-id={props.id} />
                <h3 data-artist-id={props.id}>{props.name}</h3>
            </Link>
        </li>

    )
}