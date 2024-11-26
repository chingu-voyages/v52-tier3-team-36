// css
import styles from './Landing.module.css';
import { useEffect, useState } from 'react';
import { getChildren } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth'

const Landing = () => {
  const [children, setChildren] = useState([])
  const{ curUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      const childRes = await getChildren();
      setChildren(childRes)
    };
    fetchChildren();
  }, [])

  const handleRegister = () => {
    navigate('/auth/register')
  }

  
  return (
    <main className={styles.container}>
      <h1>Kinderly</h1>
        {curUser.groups.includes(1) || curUser.username === 'testadmin' && <button onClick={handleRegister}>Register a new user</button>}
      <ul>
        {children.map((child) => {
          return <li key={child.id}>{child.first_name}</li>
        })}
      </ul>
    </main>
  )
}

export default Landing
