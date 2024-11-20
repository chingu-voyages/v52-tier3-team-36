// npm modules
import { NavLink } from 'react-router-dom'

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav>
      {user ?
        <ul>
          <li>Welcome, {user.name}</li>
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
