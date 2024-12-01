import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import ChildEdit from "./ChildEdit";
import profilePic from '../../assets/profile.png'

// CSS
import styles from './ChildDetails.module.css'
import { getCheckins, postCheckin, postCheckout } from "../../services/api";

const ChildDetails = () => {
    const location = useLocation();
    const{ curUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [child, setChild] = useState(location.state.child);
    const [checkins, setCheckins] = useState([]);
    const [checkInId, setCheckInId] = useState(null);
    const parents = location.state.parents;
    
    const childParent = parents.filter(parent => child.parent === parent.id)
    
    const handleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleSetChild = (editedChild) => {
        setChild(editedChild)
    };

    const handleCheckin = async () => {
        try{
            const response = await postCheckin(child.id, curUser.id)
            setCheckInId(response.id)
            setCheckins([response, ...checkins])
        } catch (error) {
            console.log(error)
        }
    };
    
    const handleCheckOut = async () => {
        try{
            const response = await postCheckout(checkInId, curUser.id);
            setCheckInId(null)
            setCheckins(prev_checkins => prev_checkins.map(checkin => checkin.id === response.id ?
                {...checkin, ...response} : checkin
                ))
        } catch (error) {
            console.log(error)
        }
    };
     
    useEffect(()=> {
        const fetchCheckins = async() => {
            const response = await getCheckins({child: child.id});
            setCheckins(response);
            const todayCheckin = response.filter(checkin => {
                const today = new Date()
                const todayJSON = today.toJSON().slice(0, 10);
                const checkinDateJSON = checkin.checkin.slice(0, 10);
                return checkinDateJSON === todayJSON && !checkin.checkout
            })
            if(todayCheckin.length > 0){
                setCheckInId(todayCheckin[0].id)
            }
           
        };
        fetchCheckins();
    }, []
    )

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
            <button disabled={checkInId} onClick={handleCheckin}>Checkin</button>
            <button disabled={!checkInId} onClick={handleCheckOut}>Checkout</button>
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
          { !curUser.groups.includes(3) &&
          <button onClick={handleEditing}>Edit</button>
        }
        </div>
        <div>
            <ul>
                {checkins.map(checkin => {
                    return <li key={checkin.id}>{checkin.checkin} {checkin.checkin_staff} {checkin.report_card} {checkin.report_staff} {checkin.checkout} {checkin.checkout_staff}</li>
                })}
            </ul>
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