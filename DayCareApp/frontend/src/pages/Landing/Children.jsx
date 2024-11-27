const ChildrenList = ({children}) => {
    return (
        <ul>
        {children.map((child) => {
          return <li key={child.id}>{`${child.first_name} ${child.last_name}`}<a href={child.url}>Edit</a></li>
        })}
      </ul>
    )
}

export default ChildrenList