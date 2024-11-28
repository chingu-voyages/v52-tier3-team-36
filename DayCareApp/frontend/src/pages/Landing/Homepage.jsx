// css
import styles from './Dashboard.module.css';
import { useAuth } from '../../contexts/useAuth'
// import UsersList from './Users';
// import ParentsList from './Parents';
// import ChildrenList from './Children';
import Dashboard from './Dashboard';
import Landing from './Landing';

const Homepage = () => {
  const{ curUser } = useAuth();
  
  return (
    <main className={styles.container}>
      {curUser ?
            <Dashboard curUser={curUser} />
                :
            <Landing />
      }
      
    </main>
  )
}

export default Homepage
