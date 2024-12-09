// css
import styles from './Dashboard.module.css';
import { useAuth } from '../../contexts/useAuth'
import Dashboard from './Dashboard';
import Landing from './Landing';
/**
 * Homepage component to show landing if user not logged in or dashboard if logged in - passing down the current user info
 *
 * @component
 * @returns {React.ReactElement} A dashboard or landing page element.
 */
const Homepage = () => {
  // Get curUser information from context
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
