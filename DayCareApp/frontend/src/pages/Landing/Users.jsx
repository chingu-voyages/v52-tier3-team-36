const UsersList = ({users}) => {
    return (
        <ul>
        {users.filter((user) => {
          return user.groups.includes(1) || user.groups.includes(2)
        }).map((user) => {
          return <li key={user.id}>{`${user.first_name} ${user.last_name}`}<a href={user.url}>Edit</a></li>
        })}
      </ul>
    )
}

export default UsersList