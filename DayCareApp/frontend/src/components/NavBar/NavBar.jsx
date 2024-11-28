// npm modules
import { NavLink, Link } from 'react-router-dom'
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
          <li>Welcome, <Link to='/user' state={curUser} key={curUser.id}>{curUser.username}</Link></li>
          <li><NavLink to="/">Dashboard</NavLink></li>
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
