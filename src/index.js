// The code in this file is inspired by YouTube Net Ninja's
// Supabase Tutorial: https://youtu.be/ydz7Dj5QHKY?si=4feTLjluzRx_iH4R

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// React documentation: root to show webpage on browser
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
      {/*run App.js with the root*/}
    <App />
  </React.StrictMode>
)
