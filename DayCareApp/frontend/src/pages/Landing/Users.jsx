import BadgeIcon from '@mui/icons-material/Badge';

const UsersList = ({users}) => {
    return (
        <ul>
        {users.filter((user) => {
          return user.groups.includes(1) || user.groups.includes(2)
        }).map((user) => {
          return <a href={user.url} key={user.id}><BadgeIcon sx={{ fontSize: 20 }}></BadgeIcon><li>{`${user.first_name} ${user.last_name}`} </li></a>
        })}
      </ul>
    )
}

export default UsersList