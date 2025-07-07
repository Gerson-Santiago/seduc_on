// frontend-aee-vite/src/App.jsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './AppRoutes'
// import EnvCheck from './components/EnvCheck'

// const basename = import.meta.env.VITE_BASE_URL
const basename = import.meta.env.VITE_BASE_URL || '/'


console.log('BASE URL:', basename)

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}