import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import {BrowserRouter} from 'react-router-dom'

import './index.css'

export default function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
       <App />
    </BrowserRouter>
)}