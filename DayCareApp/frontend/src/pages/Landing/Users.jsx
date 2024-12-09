import BadgeIcon from '@mui/icons-material/Badge';
import { Link } from 'react-router-dom';
/**
 * Represents a user/staff list component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object[]} props.users - An array of objects representing users/staff.
 * @returns {React.ReactElement} A list of user elements. Each user is a link to user details.
 */
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