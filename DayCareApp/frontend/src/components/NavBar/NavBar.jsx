// npm modules
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'

const NavBar = ({ user, handleLogout }) => {
  const{ curUser } = useAuth();

  return (
    <nav>
      <h1>🚼🧷Kinderly</h1>
      {curUser ?
        <ul>
          <li>Welcome, {curUser.username}</li>
          <li><NavLink to="" onClick={handleLogout}>LOG OUT</NavLink></li>
        </ul>
      :
        <ul>
          <li><NavLink to="/auth/login">Log In</NavLink></li>
        </ul>
      }
    </nav>
  )
}

export default NavBar
