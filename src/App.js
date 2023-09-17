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

// change artistplaylistalbums to artistplaylist/albums ?
export default function App() {
  const search = dataModule.getArtistSearchResults()
  const albums = dataModule.getArtistAlbums()
  return (
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/artistplaylist' element={<ArtistPlaylist data={search} />} />
        <Route path='/artistplaylistalbums' element={<ArtistPlaylistAlbums data={albums} />} />
        <Route path='/recentrewind' element={<RecentRewind />} />
        <Route path='/favorites' element={<Favorites />} />
      </Routes>
  )
}