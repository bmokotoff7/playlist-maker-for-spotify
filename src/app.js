// HTML Elements
const spotifyLoginBtn = document.getElementById('spotify-login-btn')
const welcomeMessageEl = document.getElementById('welcome-message')
const getPlaylistsBtn = document.getElementById('get-playlists-btn')

// Event Listeners
spotifyLoginBtn.addEventListener('click', requestUserAuthorization)
getPlaylistsBtn.addEventListener('click', getCurrentUserPlaylists)

// Authorization and User Data
const clientId = '26504850eab146ce841f5b9f1c03db49'
const redirectUri = 'http://127.0.0.1:5500'
let accessToken = null
let refreshToken = null
let userID = null

// API URLs
const AUTHORIZE = 'https://accounts.spotify.com/authorize'
const ME = 'https://api.spotify.com/v1/me'
const PLAYLISTS = 'https://api.spotify.com/v1/me/playlists'
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
        console.log(data)
        if (data.access_token != undefined) {
            accessToken = data.access_token
            localStorage.setItem('access_token', accessToken)
        } 
        if (data.refresh_token != undefined) {
            refreshToken = data.refresh_token
            localStorage.setItem('refresh_token', refreshToken)
        }
        // onPageLoad()
        getCurrentUserProfile()
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
        let scope = 'user-read-private user-read-email'

        localStorage.setItem('code_verifier', codeVerifier)

        let url = AUTHORIZE
        url += `?client_id=${clientId}`
        url += `&response_type=code`
        url += `&redirect_uri=${redirectUri}`
        url += `&state=${state}`
        url += `&scope=${scope}`
        url += `&show_dialog=true`
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

// API Functions
// Generic function used to make all API requests.
function callAPI(method, url, authorizationHeader, contentTypeHeader, body, callback) {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    if (authorizationHeader) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    }
    if (contentTypeHeader) {
        xhr.setRequestHeader('Content-Type', 'application/json')
    }
    xhr.send(body)
    xhr.onload = callback
}

// Makes the API call to get the current user's profile.
function getCurrentUserProfile() {
    callAPI('GET', ME, true, false, null, handleCurrentUserProfileResponse)
}

// Handles the API response from a call to getCurrentUserProfile()
function handleCurrentUserProfileResponse() {
    if (this.status === 200) {
        const data = JSON.parse(this.responseText)
        console.log(data)
        userID = data.id
        welcomeMessageEl.textContent = `Welcome, ${userID}`
    }
    else if (this.status === 401) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText)
        alert(this.responseText)
    }
}

function getCurrentUserPlaylists() {
    callAPI('GET', PLAYLISTS, true, false, null, handleCurrentUserPlaylistsResponse)
}

function handleCurrentUserPlaylistsResponse() {
    if (this.status === 200) {
        const data = JSON.parse(this.responseText)
        const playlists = data.items
        // console.log(playlists)
        playlists.forEach(function(playlist) {
            console.log(playlist.name)
        })
    }
    else if (this.status === 401) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText)
        alert(this.responseText)
    }
}