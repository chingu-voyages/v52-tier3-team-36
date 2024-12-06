import { useEffect, useState } from 'react';
import { getChildren, getUsers, getCheckedIn, getParents } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ChildrenList from "./Children";
import UsersList from "./Users";
import ParentsList from "./Parents";
import styles from './Dashboard.module.css';

const Dashboard = ({curUser}) => {
    const [children, setChildren] = useState([])
    const [curCheckedIn, setCurCheckedIn] = useState([])
    const [users, setUsers] = useState([])
    const [parents, setParents] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchData = async () => {
        const [childList, userList, checkedInList, parentsList] = await Promise.all(
          [getChildren(), getUsers(), getCheckedIn(), getParents()]
        );
        setChildren(childList);
        setUsers(userList);
        setCurCheckedIn(checkedInList);
        setParents(parentsList);
      };
      fetchData();
    }, [])
  
    const handleRegister = () => {
      navigate('/auth/register')
    }
    const handleRegisterChild = () => {
      navigate('/register-child', {state: {parents}})
    }
    
    return (
        <section>
            <h1>Dashboard</h1>
            { curUser && curUser.permissions.view_stats && 
            <div>
                <p>Total children: {children.length}</p>
                <p>Checked in: {curCheckedIn.length}</p>
            </div>}
            {/* If there is a logged in user, and the user is assinge d Administrators group display new user button*/}
            <div className={styles.actions}>
            {curUser && curUser.permissions.edit_users && <button onClick={handleRegister}>Add User</button>}
            {/* If there is a logged in user, and the user is assinged Administrators group display new user button*/}
            {curUser && curUser.permissions.edit_children && <button onClick={handleRegisterChild}>Add Child</button>}
            </div>
            <div className={styles.dashView}>
            <div className={styles.column}>
                {/* If there is a logged in user, and the user is assinged Administrators group display list of users */}
                { curUser && curUser.permissions.list_users &&
                <UsersList users={users} />
                }
            </div>
            <div className={styles.column}>
                {/* If there is a logged in user, and not a parent, display parents list */}
                { curUser && curUser.permissions.list_parents &&
                <ParentsList parents={parents} />
                }
            </div>
            <div className={styles.column}>
                <h4>Children</h4>
                <p>Checked in</p>
                { curUser && curUser.permissions.list_children &&
                <ChildrenList children={curCheckedIn} parents={parents}/>
                }
                <p>All children</p>
                {/* If there is a logged in user and it is Parents - filter only children with that parent, otherwise - all children */}
                { curUser &&
                <ChildrenList children={children} parents={parents}/>
                }
            </div>
            </div>
        </section>
    )
};

export default Dashboard;