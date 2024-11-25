// npm modules
import { useState } from 'react'
import { Routes, Route, useNavigate} from 'react-router-dom'

// pages
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'

// components
import NavBar from './components/NavBar/NavBar'

// services
import * as authService from './services/authService'

// styles
import './App.css'

function App() {
  const [user, setUser] = useState(authService.getUser())
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const handleAuthEvt = () => {
    setUser(authService.getUser())
  }

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/auth/login"
          element={<Login handleAuthEvt={handleAuthEvt} setLoggedUser={setUser}/>}
        />
      </Routes>
    </>
  )
}

export default App
