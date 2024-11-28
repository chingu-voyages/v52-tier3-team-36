import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import { Link } from 'react-router-dom';

const ParentsList = ({parents}) => {
    return (
      <ul>
        {parents.filter((user) => {
          return user.groups.includes(3)
        }).map((user) => {
          return <Link to='/user' state={user} key={user.id}><EscalatorWarningIcon sx={{ fontSize: 20 }}></EscalatorWarningIcon><li > {`${user.first_name} ${user.last_name}`}</li></Link>
        })}
      </ul>
    )
}

export default ParentsList