import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import ChildEdit from "./ChildEdit";
import profilePic from '../../assets/profile.png'
import { getCheckins, postCheckin, postCheckout } from "../../services/api";
import CheckinList from "./CheckinList";
// CSS
import styles from './ChildDetails.module.css'
/**
 * Represents a child details component.
 *
 * @component
 * @returns {React.ReactElement} Child details element.
 */
const ChildDetails = () => {
    const location = useLocation();
    const { curUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    // Get child details object from the navigation state
    const [child, setChild] = useState(location.state.child);
    const [checkins, setCheckins] = useState([]);
    const [checkInId, setCheckInId] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [resetDates, setResetDates] = useState(false);
    const parents = location.state.parents;
    
    // Get child parent object from the navigation state
    const childParent = parents.filter(parent => child.parent === parent.id)
    // Set state to show details or editing form
    const handleEditing = () => {
        setIsEditing(!isEditing);
    };
    // Add edited data to state
    const handleSetChild = (editedChild) => {
        setChild(editedChild)
    };
    // Check in a child - send the request to the backend
    const handleCheckin = async () => {
        try {
            const response = await postCheckin(child.id, curUser.id)
            setCheckInId(response.id)
            setCheckins([response, ...checkins])
        } catch (error) {
            console.log(error)
        }
    };
    // Add the new checkin data to the checkin state
    const updateCheckins = async (updatedCheckin) => {
        setCheckins(prev_checkins => prev_checkins.map(checkin => checkin.id === updatedCheckin.id ?
            { ...checkin, ...updatedCheckin } : checkin
        ))
    };
    // Send checkout request to the backend API and add the new checkin data to the checkin list state
    const handleCheckOut = async () => {
        try {
            const response = await postCheckout(checkInId, curUser.id);
            setCheckInId(null)
            setCheckins(prev_checkins => prev_checkins.map(checkin => checkin.id === response.id ?
                { ...checkin, ...response } : checkin
            ))
        } catch (error) {
            console.error(error)
        }
    };
    // Change the from data in the date range filter
    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };
    // Change the to data in the date range filter
    const handleToDateChange = (e) => {
        const newToDate = e.target.value;

        // Check if newToDate is before fromDate
        if (newToDate < fromDate) {
            console.log('To Date cannot be before From Date.');
            return; // Don't update toDate
        }

        setToDate(newToDate);
    };
    // Reset dates and show only last month checkins
    const handleResetDates = () => {
        setResetDates(resetDates => !resetDates);
        setFromDate('');
        setToDate('');
    };
    // Send a request to backend for checkins in the filtered date range
    const handleFiltering = async () => {
        const response = await getCheckins({ child: child.id, from: fromDate, to: toDate });
        setCheckins(response)
    };
    // Fetch checkins from the current month to today for the selected child
    useEffect(() => {
        const fetchCheckins = async () => {
            const response = await getCheckins({ child: child.id });
            setCheckins(response);
            const todayCheckin = response.filter(checkin => {
                const today = new Date()
                const todayJSON = today.toJSON().slice(0, 10);
                const checkinDateJSON = checkin.checkin.slice(0, 10);
                return checkinDateJSON === todayJSON && !checkin.checkout
            })
            if (todayCheckin.length > 0) {
                setCheckInId(todayCheckin[0].id)
            }
        };
        fetchCheckins();
    }, [resetDates]
    )
    
    const photo = child.upload ? child.upload : profilePic
    // If editing - show edit form, else show child details
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
                        <label>Parent/Guardian: <span>{childParent[0].first_name} {childParent[0].last_name}</span></label>
                        <label>Dob: <span>{child.dob}</span></label>
                        <label>Gender: <span>{child.gender}</span></label>
                        <label>Emergency Contact Name: <span>{child.em_contact_name}</span></label>
                        <label>Emergency Contact Phone: <span>{child.em_contact_number}</span></label>
                        <label>Notes: <span>{child.notes}</span></label>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Link to={'/'}>Go back</Link>
                    {curUser && curUser.permissions.edit_children &&
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
                <CheckinList checkins={checkins} updateCheckins={updateCheckins} user={curUser} />
            </section>
        </main>
    return (
        <>
            {content}
        </>
    )
}

export default ChildDetails;