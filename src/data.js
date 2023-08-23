let topItems = null
export function setTopItems(value) {
    topItems = value
}

export function getTopItems() {
    return topItems
}
// Create Artist Playlist Data
let artistSearchResults = null
export function setArtistSearchResults(value) {
    artistSearchResults = value
}
export function getArtistSearchResults() {
    return artistSearchResults
}

let selectedArtist = null
export function setSelectedArtist(value) {
    selectedArtist = value
}
export function getSelectedArtist() {
    return selectedArtist
}

let artistAlbums = null
export function setArtistAlbums(value) {
    artistAlbums = value
}
export function getArtistAlbums() {
    return artistAlbums
}

let albumTracks = null
export function setAlbumTracks(value) {
    albumTracks = value
}
export function getAlbumTracks() {
    return albumTracks
}

let selectedAlbumID = null
export function setSelectedAlbumID(value) {
    selectedAlbumID = value
}
export function getSelectedAlbumID() {
    return selectedAlbumID
}

let selectedAlbums = null
export function setSelectedAlbums(value) {
    selectedAlbums = value
}
export function getSelectedAlbums() {
    return selectedAlbums
}

let playlistID = null
export function setPlaylistID(value) {
    playlistID = value
}
export function getPlaylistID() {
    return playlistID
}

let creatingArtistPlaylist = false
export function setCreatingArtistPlaylist(value) {
    creatingArtistPlaylist = value
}
export function getCreatingArtistPlaylist() {
    return creatingArtistPlaylist
}

let uris = []
export function setUris(value) {
    uris = value
}
export function getUris() {
    return uris
}
export function pushUri(value) {
    uris.push(value)
}

let uriString = ''

export function appendUriString(value) {
    uriString += value
}

export function setUriString(value) {
    uriString = value
}

export function getUriString() {
    return uriString
}

export function editUriString() {
    uriString = uriString.substring(0, uriString.length - 1)
}