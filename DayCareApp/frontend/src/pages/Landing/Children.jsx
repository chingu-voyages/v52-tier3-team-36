import ChildCareIcon from '@mui/icons-material/ChildCare';

const ChildrenList = ({children}) => {
    return (
        <ul>
        {children.map((child) => {
          return <a href={child.url} key={child.id}><ChildCareIcon sx={{ fontSize: 20 }}></ChildCareIcon><li>{`${child.first_name} ${child.last_name}`}</li></a>
        })}
      </ul>
    )
}

export default ChildrenList