//frontend-aee-vite/src/AppRoutes.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard2 from './pages/Dashboard2'
import AuthCallback from './components/AuthCallback'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />
}

function NotFoundRedirect({ user }) {
  return user ? <Navigate to="/dashboard2" replace /> : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  const { user, error, loading } = useAuth()
  if (loading) {
    return null
  }

  return (
<Routes>
  <Route path="/" element={<Home />} />      
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/login" element={user ? <Navigate to="/dashboard2" replace /> : <Login loginErro={error} />} />
  <Route path="/dashboard2" element={<ProtectedRoute user={user}><Dashboard2 /></ProtectedRoute>} />
  <Route path="*" element={<NotFoundRedirect user={user} />} />
</Routes>

  )
}
