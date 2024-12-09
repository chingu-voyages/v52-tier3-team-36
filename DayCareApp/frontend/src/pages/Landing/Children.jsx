import ChildCareIcon from '@mui/icons-material/ChildCare';
import { Link } from 'react-router-dom';
/**
 * Component to show a list of children. Each child is a link to the child details
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object[]} props.children - List of children objects.
 * @param {Object[]} props.parents - List of parents object.
 * @returns {React.ReactElement} A list of children with links to the child details.
 */
const ChildrenList = ({children, parents}) => {
    return (
        <ul>
        {children.map((child) => {
          return <Link to='/child' state={{child: child, parents: parents}} key={child.id}><ChildCareIcon sx={{ fontSize: 20 }}></ChildCareIcon><li>{`${child.first_name} ${child.last_name}`}</li></Link>
        })}
      </ul>
    )
}

export default ChildrenList