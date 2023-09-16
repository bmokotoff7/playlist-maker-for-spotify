import { render } from "react-dom"
import * as apiModule from "./api.js"
import * as dataModule from "./data.js"
import renderApp from "./main.js"

// Event Listener(s) ----------------------------------------------------------------------------------------
document.addEventListener('click', function(e) {
    // Handles clicks on the login button
    if (e.target.id === 'spotify-login-btn') {
        if (!JSON.parse(localStorage.getItem('isLoggedIn')) === true) {
            apiModule.requestUserAuthorization()
        }
    }

    // Handles clicks on the logout button
    else if (e.target.id === 'user-logout-btn') {
        apiModule.userLogout()
    }

    // Handles clicks on the Home button
    else if (e.target.id === 'home-btn') {
    }

    // Handles clicks on the Create Artist Playlist button
    else if (e.target.id === 'create-artist-playlist-btn') {
        dataModule.setArtistSearchResults(null)
        dataModule.setSelectedArtistName(null)
        renderApp()
    }
    
    // Handles clicks on the Search button (Artist Playlist)
    else if (e.target.id === 'artist-search-btn') {
        const searchTerms = document.querySelector('#artist-playlist-search-terms').value
        if (searchTerms) {
            apiModule.searchForArtistsRequest(searchTerms)
        }
    }

    // Handles clicks on an artist from the search results list
    else if (e.target.dataset.artistId) {
        const selectedArtist = dataModule.getArtistSearchResults().filter(function(artist) {
            return artist.id === e.target.dataset.artistId
        })[0]
        console.log(selectedArtist.name)
        dataModule.setSelectedArtistName(selectedArtist.name)
        renderApp()
        apiModule.getArtistsAlbumsRequest(selectedArtist.id)
    }

    // Handles clicks on an album's "Select" button
    else if (e.target.dataset.albumId) {
        const albumID = e.target.dataset.albumId
        const selectBtn = document.querySelector(`[data-album-id='${e.target.dataset.albumId}']`)
        if (selectBtn.classList.contains('selected')) {
            selectBtn.classList.toggle('selected')
            selectBtn.textContent = "Select"
        }
        else {
            selectBtn.classList.toggle('selected')
            selectBtn.textContent = "Selected"
        }
    }

    // Handles clicks on an album's "Show Songs" button
    else if (e.target.dataset.albumTracks) {
        const albumID = e.target.dataset.albumTracks
        const tracksBtn = document.querySelector(`[data-album-tracks='${albumID}']`)
        const tracklist = document.querySelector(`[data-track-list='${albumID}']`)
        // if songs are showing, hide the list and change text to "show songs"
        if (tracklist.classList.contains('hidden')) {
            // show song list
            tracklist.classList.toggle('hidden')
            // change button text to "hide tracks"
            tracksBtn.textContent = "Hide Tracks"
            // call API to get tracks for the album
            dataModule.setTrackListAlbumID(albumID)
            apiModule.getAlbumTracksRequest(albumID)
        }
        else {
            // hide song list
            tracklist.classList.toggle('hidden')
            // change button text to "show tracks"
            tracksBtn.textContent = "Show Tracks"
        }
    }

    else if (e.target.id === 'ap-playlist-create-btn') {
        getSelectedAlbums()
        const playlistName = `${dataModule.getSelectedArtistName()} Album Mix`
        apiModule.createArtistPlaylist(playlistName)
    }
    
    else if (e.target.id === 'create-playlist-tab-btn') {
        showCreatePlaylistSection()
    }
    else if (e.target.id === 'create-playlist-btn') {
        const name = document.querySelector('#playlist-name').value
        const description = document.querySelector('#playlist-description').value
        apiModule.createPlaylistRequest(name, description)
    }

    else if (e.target.id === 'search-btn') {
        apiModule.searchForArtistsRequest(document.querySelector('#artist-playlist-search-terms').value)
    }

    // else if (e.target.dataset.artistId) {
    //     const selectedArtist = dataModule.getArtistSearchResults().filter(function(artist) {
    //         return artist.id === e.target.dataset.artistId
    //     })[0]
    //     dataModule.setSelectedArtistName(selectedArtist.name)
    //     hideSearchSection()
    //     showAlbumSelectionSection(selectedArtist.id)
    //     apiModule.getArtistsAlbumsRequest(selectedArtist.id)
    // }

    else if (e.target.dataset.albumTracks) {
        if (document.querySelector(`[data-song-list='${e.target.dataset.albumTracks}']`).classList.contains('hidden')) {
            document.querySelector(`[data-song-list='${e.target.dataset.albumTracks}']`).classList.remove('hidden')
            dataModule.setSelectedAlbumID(e.target.dataset.albumTracks)
            apiModule.getAlbumTracksRequest(e.target.dataset.albumTracks)
        }
        else {
            document.querySelector(`[data-song-list='${e.target.dataset.albumTracks}']`).classList.add('hidden')
        }
    }

    else if (e.target.id === 'create-album-playlist-btn') {
        dataModule.setCreatingArtistPlaylist(true)
        dataModule.setUris([])
        getSelectedAlbums()
        const playlistName = `${dataModule.getSelectedArtistName()} Album Mix`
        apiModule.createArtistPlaylist(playlistName)
    }

})

export function logTopItems() {
    console.log(dataModule.getTopItems())
}

export function displayArtistSearchResults() {
    let searchResultsHTML = ''
    const artists = dataModule.getArtistSearchResults()
    artists.forEach(function(artist) {
        searchResultsHTML += `
            <li data-artist-id=${artist.id}>
                <img src=${artist.imageUrl}>
                <p>${artist.name}</p>
            </li>
        `
    })
    // document.querySelector('#artist-search-results').innerHTML = searchResultsHTML
}

export function displayArtistAlbums() {
    const albums = dataModule.getArtistAlbums()
    let albumsHTML = ''
    albums.forEach(function(album) {
        albumsHTML += `
        <li class="album-list-item" data-album-id=${album.id}>
            <div class="album-list-item-buttons">
            <p class="album-name">${album.name}</p>
            <button data-album-tracks='${album.id}'>Show Songs</button>
            <input type='checkbox' data-album-checkbox='${album.id}'>
            </div>
            <ol class='item-list song-list hidden' data-song-list='${album.id}'>
            </ol>
        </li>
        `
    })
    document.querySelector('#album-list').innerHTML = albumsHTML
}

export function displayAlbumTracks() {
    const tracks = dataModule.getAlbumTracks()
    let tracksHTML = ''
    tracks.forEach(function(track) {
        tracksHTML += `
            <li>${track.name}</li>
        `
    })
    document.querySelector(`[data-song-list='${dataModule.getSelectedAlbumID()}']`).innerHTML = tracksHTML
}


window.addEventListener('load', onPageLoad)
function onPageLoad() {
    renderApp()
    if (window.location.search.length > 0) {
        apiModule.handleRedirect()
    }
}

function createArtistPlaylist() {
    // Reveal search section
    // showSearchSection()
    // 
    apiModule.getUserId()
}

// Styling/Layout Related Functions -------------------------------------------------------------------------
function showCreatePlaylistSection() {
    document.querySelector('.create-playlist-section').classList.remove('hidden')
    document.querySelector('#create-playlist-tab-btn').classList.add('hidden')
}

function showSearchSection() {
    document.querySelector('.search-section').classList.remove('hidden')
    document.querySelector('#create-artist-playlist-btn').classList.add('hidden')
}

function hideSearchSection() {
    document.querySelector('.search-section').classList.add('hidden')
}

function showAlbumSelectionSection(artistID) {
    document.querySelector('.album-selection-section').classList.remove('hidden')
    const selectedArtist = dataModule.getArtistSearchResults().filter(function(artist) {
        return (artist.id === artistID)
    })[0]
    // console.log(selectedArtist)
    document.querySelector('#artist-name').textContent = selectedArtist.name
}

export function getCurrentUserProfile(userID) {
    document.querySelector('#spotify-login-btn').classList.add('hidden')
    document.querySelector('#welcome-message').textContent = `Welcome, ${userID}`
    document.querySelector('main').classList.remove('hidden')
}

function resetCreateArtistPlaylist() {
    // Clear HTML elements
    document.querySelector('#artist-playlist-search-terms').value = ''
    document.querySelector('#artist-search-results').innerHTML = ''
    document.querySelector('#album-list').innerHTML = ''
    // Clear stored data
}

export function renderTrackList(trackListArray, albumID) {
    const tracklist = document.querySelector(`[data-track-list='${albumID}']`)
    tracklist.innerHTML = trackListArray.map(function(track) {
        return `<li>${track.name}</li>`
    }).join('')
}

function getSelectedAlbums() {
    const selectedAlbums = Array.from(document.querySelectorAll('.selected')).map(function(album) {
        return album.dataset.albumId
    })
    dataModule.setSelectedAlbums(selectedAlbums)
}