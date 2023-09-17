import * as apiModule from "./api.js"
import * as dataModule from "./data.js"
import renderApp from "./main.js"

// Event Listeners ------------------------------------------------------------------------------------------
document.addEventListener('click', function(e) {
    // Handles clicks on the login button
    if (e.target.id === 'spotify-login-btn') {
        if (!JSON.parse(localStorage.getItem('isLoggedIn')) === true) {
            apiModule.requestUserAuthorization()
        }
    }

    // Handles clicks on the profile button
    else if (e.target.id === 'profile-btn') {
        document.getElementById('logout-modal').classList.toggle('hidden')
    }
   
    // Handles clicks on the logout button
    else if (e.target.id === 'user-logout-btn') {
        apiModule.userLogout()
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
        if (tracklist.classList.contains('hidden')) {
            tracklist.classList.toggle('hidden')
            tracksBtn.textContent = "Hide Tracks"
            dataModule.setTrackListAlbumID(albumID)
            apiModule.getAlbumTracksRequest(albumID)
        }
        else {
            tracklist.classList.toggle('hidden')
            tracksBtn.textContent = "Show Tracks"
        }
    }

    // Handles clicks on the "Create Playlist" button on the create artist playlist page (adapt for all pages w/ data attributes)
    else if (e.target.id === 'ap-playlist-create-btn') {
        getSelectedAlbums()
        const playlistName = `${dataModule.getSelectedArtistName()} Album Mix`
        apiModule.createArtistPlaylist(playlistName)
    }

})

window.addEventListener('load', onPageLoad)
function onPageLoad() {
    renderApp()
    if (window.location.search.length > 0) {
        apiModule.handleRedirect()
    }
}

// Styling/Layout Related Functions -------------------------------------------------------------------------
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

// Renders the track list for an album
export function renderTrackList(trackListArray, albumID) {
    const tracklist = document.querySelector(`[data-track-list='${albumID}']`)
    tracklist.innerHTML = trackListArray.map(function(track) {
        return `<li>${track.name}</li>`
    }).join('')
}

// Gets all selected albums from an artist's album list
function getSelectedAlbums() {
    const selectedAlbums = Array.from(document.querySelectorAll('.selected')).map(function(album) {
        return album.dataset.albumId
    })
    dataModule.setSelectedAlbums(selectedAlbums)
}