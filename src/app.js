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
        createPlaylistCall(name, description)
    }

    else if (e.target.id === 'search-tab-btn') {
        showSearchSection()
    }

    else if (e.target.id === 'search-btn') {
        const radios = document.getElementsByName('search-radio')
        let selectedRadio = null
        for (let radio of radios) {
            if (radio.checked) {
                selectedRadio = radio.value
            }
        }
        console.log(selectedRadio)
        searchCall(selectedRadio, document.querySelector('#search-terms').value)
    }
})

spotifyLoginBtn.addEventListener('click', requestUserAuthorization)
getPlaylistsBtn.addEventListener('click', getUserPlaylistsCall)
getTopItemsBtn.addEventListener('click', getTopItemsCall)

// Authorization and User Data
const clientId = '26504850eab146ce841f5b9f1c03db49'
const redirectUri = 'http://127.0.0.1:5500'
let accessToken = null
let refreshToken = null
let userID = null

// API URLs
const AUTHORIZE = 'https://accounts.spotify.com/authorize'
const ME = 'https://api.spotify.com/v1/me'
const SEARCH = 'https://api.spotify.com/v1/search'
const TOKEN = 'https://accounts.spotify.com/api/token'


function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect()
    }
}

function handleRedirect() {
    let code = getCode()
    requestAccessToken(code)
    window.history.pushState('', '', redirectUri)
}

function requestAccessToken(code) {
    let body = ''
    body += 'grant_type=authorization_code'
    body += `&code=${code}`
    body += `&redirect_uri=${redirectUri}`
    body += `&client_id=${clientId}`
    body += `&code_verifier=${localStorage.getItem('code_verifier')}`

    callAuthorizationAPI(body)
}

function refreshAccessToken() {
    let body = ''
    body += 'grant_type=refresh_token'
    body += `&refresh_token=${refreshToken}`
    body += `&client_id=${clientId}`

    callAuthorizationAPI(body)
}

function callAuthorizationAPI(body) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', TOKEN, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(body)
    xhr.onload = handleAuthorizationResponse
}

function handleAuthorizationResponse() {
    if (this.status === 200) {
        const data = JSON.parse(this.responseText)
        // console.log(data)
        if (data.access_token != undefined) {
            accessToken = data.access_token
            localStorage.setItem('access_token', accessToken)
        } 
        if (data.refresh_token != undefined) {
            refreshToken = data.refresh_token
            localStorage.setItem('refresh_token', refreshToken)
        }
        // onPageLoad()
        getCurrentUserProfileCall()
    }
    else {
        console.log(this.responseText)
        alert(this.responseText)
    }
}

function getCode() {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    return code
}

function requestUserAuthorization() {
    let codeVerifier = generateRandomString(128)
    generateCodeChallenge(codeVerifier).then(codeChallenge => {
        let state = generateRandomString(16)
        let scope = `
            user-read-private 
            user-read-email 
            playlist-read-private 
            playlist-read-collaborative
            playlist-modify-public
            playlist-modify-private
            user-top-read
        `

        localStorage.setItem('code_verifier', codeVerifier)

        let url = AUTHORIZE
        url += `?client_id=${clientId}`
        url += `&response_type=code`
        url += `&redirect_uri=${redirectUri}`
        url += `&state=${state}`
        url += `&scope=${scope}`
        url += `&show_dialog=true` // true = requires authorization every time you log in
        url += `&code_challenge_method=S256`
        url += `&code_challenge=${codeChallenge}`

        window.location.href = url
    })
}

// Code Verifier
function generateRandomString(length) {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

// Code Challenge
async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)

    return base64encode(digest)
}

// Program-Specific Functions
function createArtistPlaylist() {
    // get artist
    // get artist's albums
    // user selects albums or selects all albums
    // create new empty playlist
    // get each album's songs and add to playlist
}

// API Functions
// function callAPI(method, url, authorizationHeader, contentTypeHeader, body, callback) {
//     let xhr = new XMLHttpRequest()
//     xhr.open(method, url, true)
//     if (authorizationHeader) {
//         xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
//     }
//     if (contentTypeHeader) {
//         xhr.setRequestHeader('Content-Type', 'application/json')
//     }
//     xhr.send(body)
//     xhr.onload = callback
// }

// Generic function used to make all API requests and handle API responses.
function callAPI(method, url, authorizationHeader, contentTypeHeader, body, callback, successCode) {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    if (authorizationHeader) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    }
    if (contentTypeHeader) {
        xhr.setRequestHeader('Content-Type', 'application/json')
    }
    xhr.send(body)
    xhr.onload = function() {
        if (this.status === successCode) {
            const data = JSON.parse(this.responseText)
            callback(data)
        }
        else if (this.status === 401) {
            refreshAccessToken()
        }
        else {
            console.log(this.responseText)
            alert(this.responseText)
        }
    }
}

// Makes the API call to access a user's top items.
// type: 'artists', 'tracks'
// timeRange: 'short_term', 'medium_term' (default), 'long_term'
// limit: 1-50 (default 20)
// offset: default 0
function getTopItemsCall() {
    let type = 'tracks'
    let timeRange = 'long_term'
    let limit = 5
    let offset = 0

    let url = `https://api.spotify.com/v1/me/top/${type}`
    url += `?time_range=${timeRange}`
    url += `&limit=${limit}`
    url += `&offset=${offset}`
    callAPI('GET', url, true, false, null, getTopItemsResponse, 200)
}

// Handles the API response from getTopItemsCall().
function getTopItemsResponse(data) {
    console.log(data)
}

// Makes the API call to get the current user's profile.
function getCurrentUserProfileCall() {
    callAPI('GET', ME, true, false, null, getCurrentUserProfileResponse, 200)
}

// Handles the API response from getCurrentUserProfileCall().
function getCurrentUserProfileResponse(data) {
    userID = data.id
    spotifyLoginBtn.classList.add('hidden')
    document.querySelector('#welcome-message').textContent = `Welcome, ${userID}`
    document.querySelector('main').classList.remove('hidden')
}

let playlistOffset = 0
// Makes the API call to get the user's playlists.
function getUserPlaylistsCall() {
    playlistOffset = 0
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`
    url += '?limit=50'
    url += `&offset=${playlistOffset}`
    callAPI('GET', url, true, false, null, getUserPlaylistsResponse, 200)
}

// Handles the API response from getCurrentUserPlaylistsCall().
function getUserPlaylistsResponse(data) {
    const playlists = data.items
    // console.log(playlists)
    playlists.forEach(function(playlist) {
        console.log(playlist.name)
    })
    if (playlists.length === 50) {
        playlistOffset += 50
        let url = `https://api.spotify.com/v1/users/${userID}/playlists`
        url += '?limit=50'
        url += `&offset=${playlistOffset}`
        callAPI('GET', url, true, false, null, getUserPlaylistsResponse, 200)
    }
}

// Makes the API call to create a new playlist for a user.
// TO-DO: accept body as parameters entered by the user (set default values if nothing is entered for optional fields)
function createPlaylistCall(name, description) {
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`
    if (name === '') {
        name = 'New Playlist'
    }
    if (description === '') {
        description = 'Created by Playlist Maker for Spotify'
    }
    let body = `{
        "name": "${name}",
        "description": "${description}",
        "public": false 
    }`
    // Note: Even though "public" is set to false, the playlist still appears as public. Look into this.
    callAPI('POST', url, true, true, body, createPlaylistResponse, 201)
}

// Handles the API response from createPlaylistCall().
function createPlaylistResponse(data) {
    const playlistName = data.name
    console.log(`"${playlistName}" created.`)
}

// Makes the API call to search for an artist.
function searchCall(type, query) {
    // let query = 'jay'
    // let type = 'artist'
    let market = 'US'
    let limit = 10
    let offset = 0

    let url = SEARCH
    url += `?q=${query}`
    url += `&type=${type}`
    url += `&market=${market}`
    url += `&limit=${limit}`
    url += `&offset=${offset}`

    callAPI('GET', url, true, false, null, searchResponse, 200)
}

// Handles the API response from searchForArtistsCall().
function searchResponse(data) {
    const albums = (data.albums.items)
    albums.forEach(function(album) {
        const artists = album.artists
        artists.forEach(function(artist) {
            console.log(artist.name)
        })
        console.log(album.name)
    })
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