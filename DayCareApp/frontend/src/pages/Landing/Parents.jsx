import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import { Link } from 'react-router-dom';
/**
 * Represents a parents list component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object[]} props.parents - An array of objects representing parents.
 * @returns {React.ReactElement} A list of parents elements. Each parent is a link to user details.
 */
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