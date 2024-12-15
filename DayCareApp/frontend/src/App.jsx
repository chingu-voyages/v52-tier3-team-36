// npm modules
import { Routes, Route, useNavigate} from 'react-router-dom'
// pages
import SettingsPage from './pages/Users/Settings'
import Login from './pages/Login/Login'
import RegisterPage from './pages/Register/Register'
import RegisterChildPage from './pages/Register/RegisterChild'
import { AuthProvider } from './contexts/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
// components
import NavBar from './components/NavBar/NavBar'
// services
import * as authService from './services/authService'
// styles
import './App.css'
import Homepage from './pages/Landing/Homepage'
import UserDetails from './pages/Users/UserDetails'
import ChildDetails from './pages/Children/ChildDetails'
/**
 * App routes component.
 *
 * @component
 * @returns {React.ReactElement} Includes the authentication provider, borwser router, and protected routes.
 */
function App() {
  const navigate = useNavigate()
  // Handle logout -sends the request to logout the user and delete auth cookies to the backend API
  const handleLogout = async () => {
    const success = await authService.logout();
    if(success){
      navigate('/auth/login?success=true')
    }
  }

  return (
    <>
    <AuthProvider>
      <NavBar handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/auth/register"
            element={<PrivateRoute><RegisterPage /></PrivateRoute>}
          />
          <Route
            path="/settings"
            element={<PrivateRoute><SettingsPage /></PrivateRoute>}
          />
          <Route
            path="/user"
            element={<PrivateRoute><UserDetails /></PrivateRoute>}
          />
          <Route
            path="/child"
            element={<PrivateRoute><ChildDetails /></PrivateRoute>}
          />
          <Route
            path="/auth/login"
            element={<Login />}
          />
          <Route
            path="/register-child"
            element={<PrivateRoute><RegisterChildPage /></PrivateRoute>}
          />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
