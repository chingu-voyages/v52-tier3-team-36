// npm modules
import { NavLink } from 'react-router-dom'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav>
      <div>
        <ChildFriendlyIcon fontSize="large" ></ChildFriendlyIcon>
        <h1>Kinderly</h1>
      </div>
      {user ?
        <ul>
          <li>Welcome, {user.first_name}</li>
          <li><NavLink to="" onClick={handleLogout}>Logout</NavLink></li>
        </ul>
      :
        <ul>
          <li><NavLink to="/auth/login">Login</NavLink></li>
        </ul>
      }
    </nav>
  )
}

export default NavBar
