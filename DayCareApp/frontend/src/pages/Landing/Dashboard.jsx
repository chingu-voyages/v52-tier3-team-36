import { useEffect, useState } from 'react';
import { getChildren, getUsers, getCheckedIn, getParents } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import ChildrenList from "./Children";
import UsersList from "./Users";
import ParentsList from "./Parents";
import styles from './Dashboard.module.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
/**
 * Dashboard component for displaying lists of staff/parents/children when a user logs in
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.curUser - Data for the current user - username, first_ and last_name, id, email, groups, permissions.
 * @returns {React.ReactElement} A dashboard element.
 */
const Dashboard = ({curUser}) => {
    const [showAlert, setShowAlert] = useState(false);
    const [children, setChildren] = useState([])
    const [curCheckedIn, setCurCheckedIn] = useState([])
    const [users, setUsers] = useState([])
    const [parents, setParents] = useState([]);
    const navigate = useNavigate();
    // Fetch the necessary data depending on user permissions - list staff, only list parents, or if list own children - only own children
    const fetchData = curUser?.permissions.list_users ? async () => {
        const [childList, userList, checkedInList, parentsList] = await Promise.all(
          [getChildren(), getUsers({params: {active: true}}), getCheckedIn(), getParents({params: {active: true}})]
        );
        setChildren(childList);
        setUsers(userList);
        setCurCheckedIn(checkedInList);
        setParents(parentsList);
      } : curUser?.permissions.list_parents ? async () => {
        const [childList, checkedInList, parentsList] = await Promise.all(
          [getChildren(), getCheckedIn(), getParents({params: {active: true}})]
        );
        setChildren(childList);
        setCurCheckedIn(checkedInList);
        setParents(parentsList);
      } : async () => {
        const [childList, checkedInList] = await Promise.all(
          [getChildren(), getCheckedIn()]
        );
        setChildren(childList);
        setCurCheckedIn(checkedInList);
      };
    // Send the request to fetch necessary data to display on the dashboard
    useEffect(() => {
      fetchData();
    }, [])
    //Check if success when adding users/children and display a banner
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('success') === 'true') {
            setShowAlert(true)
            const timeId = setTimeout(() => {
                setShowAlert(false);
            }, 15000)
            
            return () => {
                clearTimeout(timeId)
            }
        }
    }, [navigate])
    // Handle user registration - navigate to the Register component
    const handleRegister = () => {
      navigate('/auth/register')
    }
    // Handle child registration - navigate to the RegisterChild component - pass the parents in the Nav state
    const handleRegisterChild = () => {
      navigate('/register-child', {state: {parents}})
    }
    
    return (
        <section>
            {showAlert && <Alert severity="success">New record successfully registered!</Alert>}
            <div className={styles.header}>
              <DashboardIcon></DashboardIcon>
              <h1>Dashboard</h1>
            </div>
            
            {/* If a user is logged in and the user has the view_stats permission, display the stats */}
            { curUser && curUser.permissions.view_stats && 
            <div>
                <p>Total children: {children.length}</p>
                <p>Checked in: {curCheckedIn.length}</p>
            </div>}
            {/* If there is a logged in user, and the user has the edit_users permission - show new user button*/}
            <div className={styles.actions}>
            {curUser && curUser.permissions.edit_users && <button onClick={handleRegister}>Add User</button>}
            {/* If there is a logged in user, and the user has the edit_children - display new child button*/}
            {curUser && curUser.permissions.edit_children && <button onClick={handleRegisterChild}>Add Child</button>}
            </div>
            <div className={styles.dashView}>
            <div className={styles.column}>
                {/* If there is a logged in user, and the user has list_users permission - display list of staff users */}
                { curUser && curUser.permissions.list_users &&
                <UsersList users={users} />
                }
            </div>
            <div className={styles.column}>
                {/* If there is a logged in user, and the user has the list_parents permission, display parents list */}
                { curUser && curUser.permissions.list_parents &&
                <ParentsList parents={parents} />
                }
            </div>
            <div className={styles.column}>
                <h4>Children</h4>
                {/* If there is a logged in user, and the user has list_children permission - display checked in children */}
                { curUser && curUser.permissions.list_children &&
                <>
                 <p>Checked in</p>
                <ChildrenList children={curCheckedIn} parents={parents}/>
                </>
                }
                <p>All children</p>
                {/* If there is a logged in user and it has list_own_children permission - only list own children for parent, otherwise - all children */}
                { curUser &&
                <ChildrenList children={children} parents={parents}/>
                }
            </div>
            </div>
        </section>
    )
};

export default Dashboard;