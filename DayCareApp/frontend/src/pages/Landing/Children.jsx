import ChildCareIcon from '@mui/icons-material/ChildCare';
import { Link } from 'react-router-dom';

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