import * as apiModule from "./api.js"
import * as dataModule from "./data.js"

// Event Listener(s) ----------------------------------------------------------------------------------------
document.addEventListener('click', function(e) {
    if (e.target.id === 'spotify-login-btn') {
        apiModule.requestUserAuthorization()
    }

    else if (e.target.id === 'get-recent-rewind-btn') {
        apiModule.createRecentRewindPlaylist()
    }
    
    else if (e.target.id === 'create-playlist-tab-btn') {
        showCreatePlaylistSection()
    }
    else if (e.target.id === 'create-playlist-btn') {
        const name = document.querySelector('#playlist-name').value
        const description = document.querySelector('#playlist-description').value
        apiModule.createPlaylistRequest(name, description)
    }

    else if (e.target.id === 'search-tab-btn') {
        showSearchSection()
    }

    else if (e.target.id === 'search-btn') {
        apiModule.searchForArtistsRequest(document.querySelector('#artist-playlist-search-terms').value)
    }

    else if (e.target.dataset.artistId) {
        // const artistID = e.target.dataset.artistId
        // dataModule.setSelectedArtist(artistID)
        const selectedArtist = dataModule.getArtistSearchResults().filter(function(artist) {
            return artist.id === e.target.dataset.artistId
        })[0]
        dataModule.setSelectedArtistName(selectedArtist.name)
        hideSearchSection()
        showAlbumSelectionSection(selectedArtist.id)
        apiModule.getArtistsAlbumsRequest(selectedArtist.id)
    }

    else if (e.target.dataset.albumTracks) {
        document.querySelector(`[data-song-list='${e.target.dataset.albumTracks}']`).classList.remove('hidden')
        dataModule.setSelectedAlbumID(e.target.dataset.albumTracks)
        apiModule.getAlbumTracksRequest(e.target.dataset.albumTracks)
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
            <li data-artist-id=${artist.id}>${artist.name} (${artist.id})</li>
        `
    })
    document.querySelector('#artist-search-results').innerHTML = searchResultsHTML
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

function getSelectedAlbums() {
    const albumListHTML = document.querySelector('#album-list')
    const selectedAlbums = Array.from(albumListHTML.querySelectorAll('input[type="checkbox"]:checked')).map(function(album) {
        return album.dataset.albumCheckbox
    })
    dataModule.setSelectedAlbums(selectedAlbums)
}

window.addEventListener('load', onPageLoad)
function onPageLoad() {
    if (window.location.search.length > 0) {
        apiModule.handleRedirect()
    }
}

// Styling/Layout Related Functions -------------------------------------------------------------------------
function showCreatePlaylistSection() {
    document.querySelector('.create-playlist-section').classList.remove('hidden')
    document.querySelector('#create-playlist-tab-btn').classList.add('hidden')
}

function showSearchSection() {
    document.querySelector('.search-section').classList.remove('hidden')
    document.querySelector('#search-tab-btn').classList.add('hidden')
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