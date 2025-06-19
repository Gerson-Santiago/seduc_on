import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
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
  const { user, error } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard2" replace /> : <Login loginErro={error} />} />
      <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
      <Route path="/dashboard2" element={<ProtectedRoute user={user}><Dashboard2 /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundRedirect user={user} />} />
    </Routes>
  )
}
