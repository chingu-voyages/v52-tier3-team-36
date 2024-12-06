import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import ChildEdit from "./ChildEdit";
import profilePic from '../../assets/profile.png'

// CSS
import styles from './ChildDetails.module.css'
import { getCheckins, postCheckin, postCheckout } from "../../services/api";
import CheckinList from "./CheckinList";

const ChildDetails = () => {
    const location = useLocation();
    const{ curUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [child, setChild] = useState(location.state.child);
    const [checkins, setCheckins] = useState([]);
    const [checkInId, setCheckInId] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [resetDates, setResetDates] = useState(false);
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
            response.checkin_staff = curUser.username
            setCheckInId(response.id)
            setCheckins([response, ...checkins])
        } catch (error) {
            console.log(error)
        }
    };

    const updateCheckins = async (updatedCheckin) => {
        updatedCheckin.checkout_staff = curUser.username
        updatedCheckin.checkin_staff = curUser.username
        updatedCheckin.report_staff = curUser.username
        setCheckins(prev_checkins => prev_checkins.map(checkin => checkin.id === updatedCheckin.id ?
            {...checkin, ...updatedCheckin} : checkin
            ))
    };
    
    const handleCheckOut = async () => {
        try{
            const response = await postCheckout(checkInId, curUser.id);
            response.checkout_staff = curUser.username
            response.checkin_staff = curUser.username
            setCheckInId(null)
            setCheckins(prev_checkins => prev_checkins.map(checkin => checkin.id === response.id ?
                {...checkin, ...response} : checkin
                ))
        } catch (error) {
            console.error(error)
        }
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
      };
    
      const handleToDateChange = (e) => {
        const newToDate = e.target.value;
    
        // Check if newToDate is before fromDate
        if (newToDate < fromDate) {
          console.log('To Date cannot be before From Date.');
          return; // Don't update toDate
        }
    
        setToDate(newToDate);
      };

      const handleResetDates = () => {
        setResetDates(resetDates => !resetDates);
        setFromDate('');
        setToDate('');
      };

      const handleFiltering = async () => {
        const response = await getCheckins({child: child.id, from: fromDate, to: toDate});
        setCheckins(response)
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
    }, [resetDates]
    )

    const photo = child.upload ? child.upload : profilePic

    const content = isEditing ? 
    <ChildEdit child={child} parents={parents} childParent={childParent} edit={handleEditing} editedChild={handleSetChild} /> 
    :
    <main className={styles.container}>
      <section>
        <h1>{child.first_name} {child.last_name}</h1>
        {checkInId ? <p>Checked In</p> : <p>Checked Out</p>}
        {curUser && curUser.permissions.check_in &&
        <div className={styles.actions}>
          <button disabled={checkInId} onClick={handleCheckin}>Checkin</button>
          <button disabled={!checkInId} onClick={handleCheckOut}>Checkout</button>
        </div>
        }
        <div className={styles.info}>
          <img src={photo} alt="child's photo" />
          <div>
            <label>Address: <span>{child.address}</span></label>
            <label>Parent/Guardian: <span>{childParent.first_name} {childParent.last_name}</span></label>
            <label>Dob: <span>{child.dob}</span></label>
            <label>Gender: <span>{child.gender}</span></label>
            <label>Emergency Contact Name: <span>{child.em_contact_name}</span></label>
            <label>Emergency Contact Phone: <span>{child.em_contact_number}</span></label>
            <label>Notes: <span>{child.notes}</span></label>
          </div>
        </div>
        <div className={styles.actions}>
          <Link to={'/'}>Go back</Link>
          { curUser && curUser.permissions.edit_children &&
          <button onClick={handleEditing}>Edit</button>
        }
        </div>
      </section>  
      <section >
        <div className={styles.reportFilter}>
          <button onClick={handleResetDates}>Reset</button>
          <label>
            From: 
            <input type="date" value={fromDate} onChange={handleFromDateChange} />
          </label>
          <label>
            To:
            <input type="date" value={toDate} onChange={handleToDateChange} />
          </label>
          <button onClick={handleFiltering}>Search</button>
        </div>
        <CheckinList checkins={checkins} updateCheckins={updateCheckins} user={curUser}/>
      </section>
    </main>
  return (
    <>
    {content}
    </>
  )
}

export default ChildDetails;