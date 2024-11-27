const ParentsList = ({parents}) => {
    return (
      <ul>
        {parents.filter((user) => {
          return user.groups.includes(3)
        }).map((user) => {
          return <li key={user.id}>{`${user.first_name} ${user.last_name}`}<a href={user.url}>Edit</a></li>
        })}
      </ul>
    )
}

export default ParentsList