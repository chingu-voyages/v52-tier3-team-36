import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import ChildEdit from "./ChildEdit";
import profilePic from '../../assets/profile.png'

// CSS
import styles from './ChildDetails.module.css'

const ChildDetails = () => {
    const location = useLocation();
    const{ curUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [child, setChild] = useState(location.state.child);
    const parents = location.state.parents;
    
    const childParent = parents.filter(parent => child.parent === parent.id)
    
    const handleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleSetChild = (editedChild) => {
        setChild(editedChild)
    };

    const photo = child.upload ? child.upload : profilePic

    const content = isEditing ? 
    <ChildEdit child={child} parents={parents} childParent={childParent} edit={handleEditing} editedChild={handleSetChild} /> 
    :
    <main className={styles.container}>
      <section>
        <h1>{child.first_name} {child.last_name}</h1>
        <div className={styles.info}>
          <img src={photo} alt="child's photo" />
          <div>
            <p>{child.address}</p>
            <p>{childParent.first_name} {childParent.last_name}</p>
            <p>{child.dob}</p>
            <p>{child.gender}</p>
            <p>{child.em_contact_name}</p>
            <p>{child.em_contact_number}</p>
            <p>{child.notes}</p>
            
          </div>
        </div>
        <div className={styles.actions}>
          <Link to={'/'}>Go back</Link>
          <button onClick={handleEditing}>Edit</button>
        </div>
      </section>
    </main>
  return (
    <>
    {content}
    </>
  )
}

export default ChildDetails;