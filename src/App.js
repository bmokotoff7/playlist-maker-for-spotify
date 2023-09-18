import React from 'react'
import './index.css'
import {Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ArtistPlaylist from './pages/ArtistPlaylist'
import ArtistPlaylistAlbums from './pages/ArtistPlaylistAlbums'
import RecentRewind from './pages/RecentRewind'
import Favorites from './pages/Favorites'
import * as dataModule from "./data.js"
import OpenPlaylist from './pages/OpenPlaylist'

// change artistplaylistalbums to artistplaylist/albums ?
export default function App() {
  const search = dataModule.getArtistSearchResults()
  const albums = dataModule.getArtistAlbums()
  const topItems = dataModule.getTopItems()
  const playlistURL = dataModule.getPlaylistURL()
  return (
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/artistplaylist' element={<ArtistPlaylist data={search} />} />
        <Route path='/artistplaylistalbums' element={<ArtistPlaylistAlbums data={albums} link={playlistURL}/>} />
        <Route path='/recentrewind' element={<RecentRewind data={topItems} link={playlistURL} />} />
        <Route path='/favorites' element={<Favorites data={topItems} link={playlistURL} />} />
      </Routes>
  )
}