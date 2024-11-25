// css
import styles from './Landing.module.css';
import { useEffect, useState } from 'react';
import { getChildren } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [children, setChildren] = useState([])
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
      <button onClick={handleRegister}>Register a new user</button>
      <ul>
        {children.map((child) => {
          return <li>{child.first_name}</li>
        })}
      </ul>
    </main>
  )
}

export default Landing
