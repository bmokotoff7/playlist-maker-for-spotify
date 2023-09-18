import * as script from "./index.js"
import * as dataModule from './data.js'
import renderApp from "./main.js"

// Authorization and User Data ------------------------------------------------------------------------------
const clientId = '26504850eab146ce841f5b9f1c03db49'
const redirectUri = 'https://playlistmakerforspotify.netlify.app/home' 
// const redirectUri = 'http://127.0.0.1:5173/home'
let accessToken = null
let refreshToken = null
let userID = localStorage.getItem('userID') ? localStorage.getItem('userID') : null

// API URLs -------------------------------------------------------------------------------------------------
const AUTHORIZE = 'https://accounts.spotify.com/authorize?'
const ME = 'https://api.spotify.com/v1/me'
const SEARCH = 'https://api.spotify.com/v1/search?'
const TOKEN = 'https://accounts.spotify.com/api/token'

// Exported Functions ---------------------------------------------------------------------------------------
export function handleRedirect() {
    let code = getCode()
    requestAccessToken(code)
    window.history.pushState('', '', redirectUri)
}

export function requestUserAuthorization() {
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

        let args = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        })

        window.location = AUTHORIZE + args
    })
}

// Authorization Functions ----------------------------------------------------------------------------------
function requestAccessToken(code) {
    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: localStorage.getItem('code_verifier')
    })

    handleAuthorizationApiRequest(body)
}

function refreshAccessToken() {
    let body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: localStorage.getItem('refreshToken'),
        client_id: clientId
    })

    handleAuthorizationApiRequest(body)
}

function handleAuthorizationApiRequest(body) {
    const response = fetch(TOKEN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    }).then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                refreshAccessToken()
            }
            else {
                throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
            }
        }
        return response.json()
    }).then(data => {
        accessToken = data.access_token
        localStorage.setItem('accessToken', data.access_token)
        refreshToken = data.refresh_token
        localStorage.setItem('refreshToken', data.refresh_token)
        localStorage.setItem('isLoggedIn', true)
        getCurrentUserProfileRequest()
        
    }).catch(error => {
        console.error('Error:', error)
    })
}

function getCode() {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    return code
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

// API Call Handler Functions -------------------------------------------------------------------------------
function handleApiRequest(method, url, authorizationHeader, contentTypeHeader, body, callback) {
    const headers = getHeaders(authorizationHeader, contentTypeHeader)
    const response = fetch(url, {
        method: method,
        headers: headers,
        body: body
    }).then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                refreshAccessToken()
            }
            else if (response.status === 502 || response.status === 500) {
                handleApiRequest(method, url, authorizationHeader, contentTypeHeader, body, callback)
            }
            else {
                throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
            }
        }
        return response.json()
    }).then(data => {
        callback(data)
    }).catch(error => {
        console.error('Error:', error)
    })
}

function getHeaders(authorizationHeader, contentTypeHeader) {
    accessToken = localStorage.getItem('accessToken')
    let headers = null
    if (authorizationHeader && contentTypeHeader) {
        headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        
        }
    }
    else if (authorizationHeader && !contentTypeHeader) {
        headers = {
            'Authorization': `Bearer ${accessToken}`
        }
    }
    return headers
}

// API Request Functions ------------------------------------------------------------------------------------
function getCurrentUserProfileRequest() {
    handleApiRequest('GET', ME, true, false, null, getCurrentUserProfileResponse)
}

export function getUserPlaylistsRequest() {
    let url = `https://api.spotify.com/v1/users/${userID}/playlists?`
    let args = new URLSearchParams({
        limit: 50
    })

    handleApiRequest('GET', url + args, true, false, null, getUserPlaylistsResponse)
}

export function createPlaylistRequest(name, description) {
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`
    if (name === '') {
        name = 'New Playlist'
    }
    if (description === undefined) {
        description = 'Created by Playlist Maker for Spotify'
    }
    let body = `{
        "name": "${name}",
        "description": "${description}",
        "public": false 
    }`

    // Note: Even though "public" is set to false, the playlist still appears as public. Look into this.
    handleApiRequest('POST', url, true, true, body, createPlaylistResponse)
}

export function searchForArtistsRequest(query) {
    let type = 'artist'
    let market = 'US'
    let limit = 10
    let offset = 0

    let url = SEARCH
    let args = new URLSearchParams({
        q: query,
        type: type,
        market: market,
        limit: limit,
        offset: offset
    })

    handleApiRequest('GET', url + args, true, false, null, searchForArtistsResponse)
}

// UPDATE: add other groups, add functionality to get next page of albums in response
export function getArtistsAlbumsRequest(artistID) {
    let include_groups = 'album' // have user specify this later with checkboxes
    let market = 'US'
    let limit = 50
    let offset = 0

    let url = `https://api.spotify.com/v1/artists/${artistID}/albums?`
    let args = new URLSearchParams({
        include_groups: include_groups,
        market: market,
        limit: limit,
        offset: offset
    })

    handleApiRequest('GET', url + args, true, false, null, getArtistsAlbumsResponse)
}

export function getAlbumTracksRequest(albumID) {
    let market = 'US'
    let limit = 50
    let offset = 0
    
    let url = `https://api.spotify.com/v1/albums/${albumID}/tracks?`
    let args = new URLSearchParams({
        market: market,
        limit: limit,
        offset: offset
    })

    handleApiRequest('GET', url + args, true, false, null, getAlbumTracksResponse)
}

function addItemsToPlaylistRequest(playlistID, uris, uriString) {
    let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?`

    let args = new URLSearchParams({
        position: 0,
        uris: uriString
    })

    let body = `{
        "uris": {"uris": ${uris}},
        "position": 0
    }`
    
    handleApiRequest('POST', url + args, true, true, body, addItemsToPlaylistResponse)
}

export function getTopItemsRequest(timeRange, limit) {
    let type = 'tracks' // type: 'artists', 'tracks'
    // timeRange: 'short_term', 'medium_term' (default), 'long_term'
    // limit: 1-50 (default 20)
    let offset = 0 // offset: default 0

    let url = `https://api.spotify.com/v1/me/top/${type}?`
    let args = new URLSearchParams({
        time_range: timeRange,
        limit: limit,
        offset: offset
    })

    handleApiRequest('GET', url + args, true, false, null, getTopItemsResponse)
}

// API Response Functions -----------------------------------------------------------------------------------
function getCurrentUserProfileResponse(data) {
    userID = data.id
    const displayName = data.display_name
    console.log(displayName)
    localStorage.setItem('userID', userID)
    localStorage.setItem('displayName', displayName)
    renderApp()
}

function getUserPlaylistsResponse(data) {
    const playlists = data.items
    playlists.forEach(function(playlist) {
        console.log(playlist.name)
    })
    if (data.next) {
        handleApiRequest('GET', data.next, true, false, null, getUserPlaylistsResponse)
    }
}

function createPlaylistResponse(data) {
    dataModule.setPlaylistID(data.id)
    console.log(`${data.name} created.`)
}

function searchForArtistsResponse(data) {
    const artists = data.artists.items
    const artistsArray = artists.map(function(artist) {
        return {
            name: artist.name,
            id: artist.id,
            imageUrl: (artist.images[0] ? artist.images[0].url : null)
        }
    })
    dataModule.setArtistSearchResults(artistsArray)
    renderApp()
}

function getArtistsAlbumsResponse(data) {
    const albums = data.items
    const albumsArray = []
    albums.forEach(function(album) {
        albumsArray.push({
            name: album.name,
            id: album.id,
            uri: album.uri
        })
    })
    dataModule.setArtistAlbums(albumsArray)
    renderApp()
}

function getAlbumTracksResponse(data) {
    const tracks = data.items
    console.log(tracks)
    const tracksArray = []
    tracks.forEach(function(track) {
        tracksArray.push({
            name: track.name,
            id: track.id,
            uri: track.uri
        })
    })
    dataModule.setAlbumTracks(tracksArray)
    script.renderTrackList(tracksArray, dataModule.getTrackListAlbumID())
}

function addItemsToPlaylistResponse(data) {
    console.log(data)
}

function getTopItemsResponse(data) {
    const tracks = data.items
    const topItems = tracks.map(function(track) {
        return {
            name: track.name,
            artists: track.artists,
            uri: track.uri
        }
    })
    dataModule.setTopItems(topItems)
    console.log(dataModule.getTopItems())
    renderApp()
}

// Trial Functions ------------------------------------------------------------------------------------------
export function createArtistPlaylist(name) {

    // Create new playlist
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`
    let body = `{
        "name": "${name}",
        "description": "Created by Playlist Maker for Spotify",
        "public": false 
    }`

    const headers = getHeaders(true, true)
    const response = fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    }).then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                refreshAccessToken()
            }
            else {
                throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
            }
        }
        return response.json()
    }).then(data => {

        // Add selected albums to new playlist
        dataModule.setPlaylistURL(data.external_urls.spotify)
        renderApp()
        dataModule.setPlaylistID(data.id)
        const albums = dataModule.getSelectedAlbums()
        console.log(albums)
        albums.forEach(function(album) {

            let market = 'US'
            let limit = 50
            let offset = 0
            
            let url = `https://api.spotify.com/v1/albums/${album}/tracks?`
            let args = new URLSearchParams({
                market: market,
                limit: limit,
                offset: offset
            })

            const headers = getHeaders(true, false)
            const response = fetch(url + args, {
                method: 'GET',
                headers: headers,
                body: null
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        refreshAccessToken()
                    }
                    else {
                        throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
                    }
                }
                return response.json()
            }).then(data => {

                // Add all tracks from album to the playlist
                const tracks = data.items
                const tracksArray = tracks.map(function(track) {
                    return track.uri
                })
                dataModule.setUris([])
                dataModule.setUriString('')
                tracksArray.forEach(function(uri) {
                    dataModule.pushUri(uri)
                    dataModule.appendUriString(`${uri},`)
                })
                dataModule.editUriString()
                addItemsToPlaylistRequest(dataModule.getPlaylistID(), dataModule.getUris(), dataModule.getUriString())            
            }).catch(error => {
                console.error('Error:', error)
            })
        })
    }).catch(error => {
        console.error('Error:', error)
    })
}

export function createRecentRewindPlaylist() {
    // Create Playlist
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`
    let body = `{
        "name": "Your Recent Rewind",
        "description": "Created by Playlist Maker for Spotify",
        "public": false 
    }`
    const response = fetch(url, {
        method: 'POST',
        headers: getHeaders(true, true),
        body: body
    }).then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                refreshAccessToken()
            }
            else if (response.status === 502 || response.status === 500) {
                handleApiRequest(method, url, authorizationHeader, contentTypeHeader, body, callback)
            }
            else {
                throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
            }
        }
        return response.json()
    }).then(data => {

        dataModule.setPlaylistURL(data.external_urls.spotify)
        renderApp()
        dataModule.setPlaylistID(data.id)
        // Get user's top 30 songs in the last month
        let type = 'tracks' // type: 'artists', 'tracks'
        let timeRange = 'short_term' // timeRange: 'short_term', 'medium_term' (default), 'long_term'
        let limit = 30 // limit: 1-50 (default 20)
        let offset = 0 // offset: default 0

        let url = `https://api.spotify.com/v1/me/top/${type}?`
        let args = new URLSearchParams({
            time_range: timeRange,
            limit: limit,
            offset: offset
        })

        const response = fetch(url + args, {
            method: 'GET',
            headers: getHeaders(true, false),
            body: null
        }).then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    refreshAccessToken()
                }
                else if (response.status === 502 || response.status === 500) {
                    handleApiRequest(method, url, authorizationHeader, contentTypeHeader, body, callback)
                }
                else {
                    throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
                }
            }
            return response.json()
        }).then(data => {
            const tracks = data.items
            const tracksArray = []
            tracks.forEach(function(track) {
                tracksArray.push({
                    uri: track.uri
                })
            })
            dataModule.setUris([])
            dataModule.setUriString('')
            tracksArray.forEach(function(track) {
                dataModule.pushUri(track.uri)
                dataModule.appendUriString(`${track.uri},`)
            })
            dataModule.editUriString()
            addItemsToPlaylistRequest(dataModule.getPlaylistID(), dataModule.getUris(), dataModule.getUriString())
            
        }).catch(error => {
            console.error('Error:', error)
        })

    }).catch(error => {
        console.error('Error:', error)
    })    
    // Create playlist with those songs
}


export function createFavoritesPlaylist() {
    // Create Playlist
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`
    let body = `{
        "name": "Your All Time Favorites",
        "description": "Created by Playlist Maker for Spotify",
        "public": false 
    }`
    const response = fetch(url, {
        method: 'POST',
        headers: getHeaders(true, true),
        body: body
    }).then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                refreshAccessToken()
            }
            else if (response.status === 502 || response.status === 500) {
                handleApiRequest(method, url, authorizationHeader, contentTypeHeader, body, callback)
            }
            else {
                throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
            }
        }
        return response.json()
    }).then(data => {

        dataModule.setPlaylistURL(data.external_urls.spotify)
        renderApp()
        dataModule.setPlaylistID(data.id)
        // Get user's top 50 songs of all time
        let type = 'tracks' // type: 'artists', 'tracks'
        let timeRange = 'long_term' // timeRange: 'short_term', 'medium_term' (default), 'long_term'
        let limit = 50 // limit: 1-50 (default 20)
        let offset = 0 // offset: default 0

        let url = `https://api.spotify.com/v1/me/top/${type}?`
        let args = new URLSearchParams({
            time_range: timeRange,
            limit: limit,
            offset: offset
        })

        const response = fetch(url + args, {
            method: 'GET',
            headers: getHeaders(true, false),
            body: null
        }).then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    refreshAccessToken()
                }
                else if (response.status === 502 || response.status === 500) {
                    handleApiRequest(method, url, authorizationHeader, contentTypeHeader, body, callback)
                }
                else {
                    throw new Error(`HTTP status ${response.status}: ${response.statusText}`)
                }
            }
            return response.json()
        }).then(data => {
            const tracks = data.items
            const tracksArray = []
            tracks.forEach(function(track) {
                tracksArray.push({
                    uri: track.uri
                })
            })
            dataModule.setUris([])
            dataModule.setUriString('')
            tracksArray.forEach(function(track) {
                dataModule.pushUri(track.uri)
                dataModule.appendUriString(`${track.uri},`)
            })
            dataModule.editUriString()
            addItemsToPlaylistRequest(dataModule.getPlaylistID(), dataModule.getUris(), dataModule.getUriString())
            
        }).catch(error => {
            console.error('Error:', error)
        })

    }).catch(error => {
        console.error('Error:', error)
    })
}

export function getUserId() {
    console.log(userID)
}

export function userLogout() {
    localStorage.removeItem('userID')
    localStorage.removeItem('displayName')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('code_verifier')
    localStorage.removeItem('refreshToken')
    localStorage.setItem('isLoggedIn', false)
}