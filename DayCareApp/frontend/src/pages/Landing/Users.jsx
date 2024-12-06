import BadgeIcon from '@mui/icons-material/Badge';
import { Link } from 'react-router-dom';

const UsersList = ({users}) => {
    return (
        <>
        <h4>Staff</h4>
        <ul>
        {users.map((user) => {
          return <Link to='/user' state={user} key={user.id}><BadgeIcon sx={{ fontSize: 20 }}></BadgeIcon><li>{`${user.first_name} ${user.last_name}`} </li></Link>
        })}
      </ul>
      </>
    )
}

export default UsersList