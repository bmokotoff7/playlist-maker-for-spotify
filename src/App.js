import React from 'react'
import './index.css'
import {Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ArtistPlaylist from './pages/ArtistPlaylist'



export default function App() {
  return (
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/artistplaylist' element={<ArtistPlaylist />} />
      </Routes>
  )
}