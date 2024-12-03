import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import UserEdit from "./UserEdit";
import { getGroups } from '../../services/api';
import AdminPasswordChange from "./AdminPasswordChange";
import { useAuth } from "../../contexts/useAuth";
import SelfPasswordChange from "./SelfPasswordChange";

// css
import styles from './UserDetails.module.css';

const UserDetails = () => {
    const location = useLocation();
    const{ curUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPass, setIsChangingPass] = useState(false);
    const [user, setUser] = useState(location.state)
    const [userGroups, setUserGroups] = useState([]);
    const groupName = userGroups.filter(group => user.groups.includes(group.id)).map(group => group.name)

    const handleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleIsChangingPass = () => {
        setIsChangingPass(!isChangingPass);
    };

    const handleSetUser = (editedUser) => {
        setUser(editedUser)
    };

    useEffect(() => {
        const fetchGroups = async () => {
          const groupRes = await getGroups();
          setUserGroups(groupRes)
        };
        fetchGroups();
      }, [])

    const resetOrChangePass = user.username === curUser.username ? <SelfPasswordChange user={user} edit={handleIsChangingPass}/> :
                            <AdminPasswordChange user={user} edit={handleIsChangingPass}/>
    const content = isEditing ? <UserEdit user={user} userGroups={userGroups} edit={handleEditing} editedUser={handleSetUser} /> :
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
        {content}
        </>
    )
}

export default UserDetails;