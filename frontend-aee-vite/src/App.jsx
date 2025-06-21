import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './AppRoutes'
import EnvCheck from './components/EnvCheck'



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
            <>
      {/* Seu conteúdo */}
      <EnvCheck />
    </>

      </AuthProvider>
    </BrowserRouter>
  )
}
