import * as apiModule from "./api.js"
import * as dataModule from "./data.js"

// HTML Elements
const spotifyLoginBtn = document.getElementById('spotify-login-btn')
const welcomeMessageEl = document.getElementById('welcome-message')
const getPlaylistsBtn = document.getElementById('get-playlists-btn')
const getTopItemsBtn = document.getElementById('get-top-items-btn')

// Event Listener(s)
document.addEventListener('click', function(e) {
    if (e.target.id === 'create-playlist-tab-btn') {
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
        apiModule.searchForArtistsRequest(document.querySelector('#search-terms').value)
    }

    else if (e.target.dataset.artistId) {
        const artistID = e.target.dataset.artistId
        dataModule.setSelectedArtist(artistID)
        // use artist id to get the search list item 
        hideSearchSection()
        showAlbumSelectionSection(artistID)
        apiModule.getArtistsAlbumsRequest(artistID)
    }

    else if (e.target.dataset.albumId) {
        document.querySelector(`[data-song-list='${e.target.dataset.albumId}']`).classList.remove('hidden')
        dataModule.setSelectedAlbumID(e.target.dataset.albumId)
        apiModule.getAlbumTracksRequest(e.target.dataset.albumId)
    }

    else if (e.target.id === 'create-album-playlist-btn') {
        dataModule.setCreatingArtistPlaylist(true)
        dataModule.setUris([])
        getSelectedAlbums()
        apiModule.createPlaylistRequest('Artist Mix')
    }

})

function createArtistPlaylist() {
    apiModule.createPlaylistRequest('Artist Mix')
}

spotifyLoginBtn.addEventListener('click', apiModule.requestUserAuthorization)
getPlaylistsBtn.addEventListener('click', apiModule.getUserPlaylistsRequest)
getTopItemsBtn.addEventListener('click', apiModule.getTopItemsRequest)

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
    document.querySelector('#search-results').innerHTML = searchResultsHTML
}

export function displayArtistAlbums() {
    const albums = dataModule.getArtistAlbums()
    let albumsHTML = ''
    albums.forEach(function(album) {
        albumsHTML += `
        <li data-album-id=${album.id}>
            ${album.name} (${album.id})
            <input type='checkbox' data-album-checkbox='${album.id}'>
            <ol class='item-list song-list hidden' data-song-list='${album.id}'>
                <p>Album songs</p>    
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

// Styling/Layout Related Functions
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
    spotifyLoginBtn.classList.add('hidden')
    document.querySelector('#welcome-message').textContent = `Welcome, ${userID}`
    document.querySelector('main').classList.remove('hidden')
}