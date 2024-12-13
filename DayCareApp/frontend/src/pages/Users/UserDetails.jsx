import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import UserEdit from "./UserEdit";
import { getGroups } from '../../services/api';
import AdminPasswordChange from "./AdminPasswordChange";
import { useAuth } from "../../contexts/useAuth";
import SelfPasswordChange from "./SelfPasswordChange";
import { Alert } from "@mui/material";
// css
import styles from './UserDetails.module.css';
/**
 * Represents a user details component.
 *
 * @component
 * @returns {React.ReactElement} A user details element.
 */
const UserDetails = () => {
    const location = useLocation();
    const{ curUser } = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMsg] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPass, setIsChangingPass] = useState(false);
    // Get selected user from passed navigation state
    const [user, setUser] = useState(location.state)
    const [userGroups, setUserGroups] = useState([]);
    // Filter the current user group name from the list of groups
    const groupName = userGroups.filter(group => user.groups.includes(group.id)).map(group => group.name)
    // Show/hide edit form
    const handleEditing = () => {
        setIsEditing(!isEditing);
    };
    // Show hide password reset form
    const handleIsChangingPass = () => {
        setAlertMsg(`Password successfully changed!`)
        setShowAlert(true)
        setIsChangingPass(!isChangingPass);
    };
    // Add selected user details to state
    const handleSetUser = (editedUser) => {
        setAlertMsg(`User ${editedUser.username} successfully updated!`)
        setShowAlert(true)
        setUser(editedUser)
    };
    // Fetch all available groups
    useEffect(() => {
        const fetchGroups = async () => {
          const groupRes = await getGroups();
          setUserGroups(groupRes)
        };
        fetchGroups();
      }, [])
    //Hide alert after 3 seconds.
    useEffect(() => {
            const timeId = setTimeout(() => {
                setShowAlert(false);
                setAlertMsg('');
            }, 15000)
            
            return () => {
                clearTimeout(timeId)
            }
    }, [showAlert])
    //   If current user is changing password - show the user change form, if admin - show only reset password form
    const resetOrChangePass = user.username === curUser.username ? <SelfPasswordChange user={user} edit={handleIsChangingPass}/> :
                            <AdminPasswordChange user={user} edit={handleIsChangingPass}/>
    // If editing - show user edit form, if changing/resetting pass - show pass forms, otherwise show user details
    const content = isEditing ? <UserEdit curUser={curUser} user={user} userGroups={userGroups} edit={handleEditing} editedUser={handleSetUser} /> :
                   isChangingPass ? resetOrChangePass :
                  <main className={styles.container}>
                    <section>
                      <h1>{user.first_name} {user.last_name}</h1>
                      <div className={styles.info}>
                        <label>Username: <span>{user.username}</span></label>
                        <label>Email: <span>{user.email}</span></label>
                        <label>Access Level: <span>{groupName[0]}</span></label>
                      </div>
                      <div className={styles.actions}>
                        <Link to={'/'}>Go back</Link>
                        <button onClick={handleEditing}>Edit</button>
                      </div>
                      <button onClick={handleIsChangingPass} className={styles.button}>Change password</button>
                    </section>
                  </main>
    return (
        <>
        {showAlert && <Alert severity="success">{alertMessage}</Alert>}
        {content}
        </>
    )
}

export default UserDetails;