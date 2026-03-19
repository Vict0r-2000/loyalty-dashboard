import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Scan from './pages/Scan'
import Register from './pages/Register'
import Profile from './pages/Profile'

interface PrivateRouteProps {
  children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('token')
  console.log('PrivateRoute token:', token ? 'EXISTS' : 'MISSING')
  if (!token) return <Navigate to="/login" />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register/:programId" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/scan" element={<PrivateRoute><Scan /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
