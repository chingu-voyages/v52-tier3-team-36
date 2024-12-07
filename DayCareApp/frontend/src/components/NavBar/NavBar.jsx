// npm modules
import { NavLink, Link } from 'react-router-dom'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import { useAuth } from '../../contexts/useAuth'
/**
 * Represents a navbar component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {AppState} props.handleLogout - Send the request to logout the user.
 * @returns {React.ReactElement} A navigation element.
 */
const NavBar = ({ handleLogout }) => {
  // Get current user from context if any
  const{ curUser } = useAuth();
  return (
    <nav>
      <div>
        <ChildFriendlyIcon fontSize="large" ></ChildFriendlyIcon>
        <h1>Kinderly</h1>
      </div>
      {curUser ?
        <ul>
          <li>Welcome, <Link to='/user' state={curUser} key={curUser.id}>{curUser.username}</Link></li>
          <li><NavLink to="/">Dashboard</NavLink></li>
          {curUser.permissions.edit_users &&
          <li><NavLink to="/settings">Settings</NavLink></li>
          }
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
