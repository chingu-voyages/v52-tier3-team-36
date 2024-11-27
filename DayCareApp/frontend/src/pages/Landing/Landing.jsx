// css
import styles from './Landing.module.css';
import { Children, useEffect, useState } from 'react';
import { getChildren, getUsers } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth'
import UsersList from './Users';
import ParentsList from './Parents';
import ChildrenList from './Children';

const Landing = () => {
  const [children, setChildren] = useState([])
  const [users, setUsers] = useState([])
  const{ curUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [childList, userList] = await Promise.all(
        [getChildren(), getUsers()]
      );
      setChildren(childList);
      setUsers(userList);
    };
    fetchData();
  }, [])

  const handleRegister = () => {
    navigate('/auth/register')
  }
  const handleRegisterChild = () => {
    navigate('/register-child')
  }
  console.log(users, children)
  return (
    <main className={styles.container}>
      <h1>Kinderly</h1>
      {/* If there is a logged in user, and the user is assinge d Administrators group display new user button*/}
      {curUser && curUser.groups.includes(1) || curUser && curUser.username === 'testadmin' && <button onClick={handleRegister}>Register a new user</button>}
      {/* If there is a logged in user, and the user is assinged Administrators group display new user button*/}
      {curUser && curUser.groups.includes(1) || curUser && curUser.username === 'testadmin' && <button onClick={handleRegisterChild}>Register a new child</button>}
      {/* If there is a logged in user and it is Parents - filter only children with that parent, otherwise - all children */}
      { curUser &&
        <ChildrenList children={children} />
      }
      {/* If there is a logged in user, and the user is assinged Administrators group display list of users */}
      { curUser && curUser.groups.includes(1) || curUser && curUser.username === 'testadmin' &&
        <UsersList users={users} />
      }
      {/* If there is a logged in user, and not a parent, display parents list */}
      { curUser && !curUser.groups.includes(3) &&
        <ParentsList parents={users} />
      }
    </main>
  )
}

export default Landing
