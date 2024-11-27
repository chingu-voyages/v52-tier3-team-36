import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';

const ParentsList = ({parents}) => {
    return (
      <ul>
        {parents.filter((user) => {
          return user.groups.includes(3)
        }).map((user) => {
          return <a href={user.url} key={user.id}><EscalatorWarningIcon sx={{ fontSize: 20 }}></EscalatorWarningIcon><li > {`${user.first_name} ${user.last_name}`}</li></a>
        })}
      </ul>
    )
}

export default ParentsList