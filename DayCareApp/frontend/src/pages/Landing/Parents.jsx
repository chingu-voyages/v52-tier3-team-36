import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import { Link } from 'react-router-dom';

const ParentsList = ({parents}) => {
    return (
      <>
      <h4>Parents/Guardians</h4>
      <ul>
        {parents.map((parent) => {
          return <Link to='/user' state={parent} key={parent.id}><EscalatorWarningIcon sx={{ fontSize: 20 }}></EscalatorWarningIcon><li > {`${parent.first_name} ${parent.last_name}`}</li></Link>
        })}
      </ul>
      </>
    )
}

export default ParentsList