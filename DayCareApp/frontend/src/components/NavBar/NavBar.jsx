// npm modules
import { NavLink } from 'react-router-dom'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import { useAuth } from '../../contexts/useAuth'

const NavBar = ({ handleLogout }) => {
  const{ curUser } = useAuth();

  return (
    <nav>
      <div>
        <ChildFriendlyIcon fontSize="large" ></ChildFriendlyIcon>
        <h1>Kinderly</h1>
      </div>
      {curUser ?
        <ul>
          <li>Welcome, {curUser.username}</li>
          <li><NavLink to="" onClick={handleLogout}>LOG OUT</NavLink></li>
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
