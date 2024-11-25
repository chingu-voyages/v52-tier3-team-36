// npm modules
import { useState } from 'react'
import { Routes, Route, useNavigate} from 'react-router-dom'

// pages
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import RegisterPage from './pages/Register/Register'
import { AuthProvider } from './contexts/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
// components
import NavBar from './components/NavBar/NavBar'

// services
import * as authService from './services/authService'

// styles
import './App.css'

function App() {
  const [user, setUser] = useState()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const success = await authService.logout();
    if(success){
      setUser(null)
      navigate('/auth/login')
    }

  }

  // const handleAuthEvt = () => {
  //   setUser(authService.getUser())
  // }

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute><Landing /></PrivateRoute>} />
          <Route
            path="/auth/register"
            element={<PrivateRoute><RegisterPage /></PrivateRoute>}
          />
          <Route
            path="/auth/login"
            element={<Login setLoggedUser={setUser}/>}
          />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
