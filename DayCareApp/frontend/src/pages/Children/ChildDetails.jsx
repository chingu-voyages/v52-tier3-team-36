import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import ChildEdit from "./ChildEdit";
import profilePic from '../../assets/profile.png'
import { getCheckins, postCheckin, postCheckout, uploadImage } from "../../services/api";
import CheckinList from "./CheckinList";
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { Alert } from "@mui/material";
import { isValidImage, MAX_FILE_SIZE } from "../../services/fileValidate";
import * as yup from 'yup';
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
    const [message, setMessage] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    // Get child details object from the navigation state
    const [child, setChild] = useState(location.state.child);
    const [checkins, setCheckins] = useState([]);
    const [checkInId, setCheckInId] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [resetDates, setResetDates] = useState(false);
    const parents = location.state.parents;
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        upload: ''
    })
    // Form validation schema
    const schema = yup.object({
        upload: yup
      .mixed()
      .test("is-valid-type", "Not a valid image type. Image must be jpeg, jpg, or png.",
        value => isValidImage(value && value.name.toLowerCase(), "image"))
      .test("is-valid-size", "Max allowed image size is 1MB",
        value => value && value.size <= MAX_FILE_SIZE)
      });
    // Get child parent object from the navigation state
    const childParent = parents.filter(parent => child.parent === parent.id)
    // Set state to show details or editing form
    const handleEditing = () => {
        setIsEditing(!isEditing);
    };
    // Add edited data to state
    const handleSetChild = (editedChild) => {
        setAlertMsg(`Details for ${editedChild.first_name} successfully updated!`)
        setAlertSeverity("success")
        setShowAlert(true)
        setChild(editedChild)
    };
    // Check in a child - send the request to the backend
    const handleCheckin = async () => {
        try {
            const response = await postCheckin(child.id, curUser.id)
            setCheckInId(response.id)
            setCheckins([response, ...checkins])
            setAlertMsg(`${child.first_name} successfully checked in!`)
            setAlertSeverity("success")
            setShowAlert(true)
        } catch (error) {
            console.error(error)
        }
    };
    // Add the new checkin data to the checkin state
    const updateCheckins = async (updatedCheckin) => {
        setCheckins(prev_checkins => prev_checkins.map(checkin => checkin.id === updatedCheckin.id ?
            { ...checkin, ...updatedCheckin } : checkin
        ))
        setAlertSeverity("info")
        setAlertMsg(`Report card for ${new Date(updatedCheckin.checkin).toLocaleDateString()} successfully added!`)
        setShowAlert(true)
    };
    // Send checkout request to the backend API and add the new checkin data to the checkin list state
    const handleCheckOut = async () => {
        try {
            const response = await postCheckout(checkInId, curUser.id);
            setCheckInId(null)
            setCheckins(prev_checkins => prev_checkins.map(checkin => checkin.id === response.id ?
                { ...checkin, ...response } : checkin
            ))
            setAlertMsg(`${child.first_name} successfully checked out!`)
            setAlertSeverity("warning")
            setShowAlert(true)
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
    //Adds the uploaded photo to formData
    const handlePhotoUpload = (evt) => {
        setFormData({ ...formData, upload: evt.target.files[0] })
    }
    //Submits photo to backend after Save
    const handlePhotoSubmit = async evt => {
        evt.preventDefault()
        try {
          if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
            throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
          }
          //Validates file size and type
          await schema.validate(formData, { abortEarly: false });
          const response = await uploadImage(formData, child.url);
          //Updates the child data with the new image
          if(response){
            setChild({...child, upload: response.upload})
            setIsUploading(false)
          }
        } catch (err) {
            if(err?.inner){
                const newErrors= [];
                err.inner.forEach((error) => {
                  newErrors.push(error.message)
                })
                setMessage(newErrors)
              } else {
                setMessage([err.message])
              }
        }
      }
    // Fetch checkins from the current month to today for the selected child
    useEffect(() => {
        const fetchCheckins = async () => {
            const response = await getCheckins({ child: child.id });
            setCheckins(response);
            const openCheckin = response.filter(checkin => {
                return !checkin.checkout
            })
            if (openCheckin.length > 0) {
                setCheckInId(openCheckin[0].id)
            }
        };
        fetchCheckins();
    }, [resetDates]
    )

    //Hide alert after 3 seconds.
    useEffect(() => {
            const timeId = setTimeout(() => {
                setShowAlert(false);
                setAlertMsg('')
            }, 15000)
            
            return () => {
                clearTimeout(timeId)
            }
    }, [showAlert])
    
    const photo = child.upload ? child.upload : profilePic
    // If editing - show edit form, else show child details
    const content = isEditing ?
        <ChildEdit child={child} parents={parents} childParent={childParent} edit={handleEditing} editedChild={handleSetChild} />
        :
        <main className={styles.container}>
            <section>
                <div className={styles.header}>
                    <ChildCareIcon></ChildCareIcon>
                    <h1>{child.first_name} {child.last_name}</h1>
                </div>
                {checkInId ? <p>Checked In</p> : <p>Checked Out</p>}
                {curUser && curUser.permissions.check_in &&
                    <div className={styles.actions}>
                        <button disabled={checkInId} onClick={handleCheckin}>Checkin</button>
                        <button disabled={!checkInId} onClick={handleCheckOut}>Checkout</button>
                    </div>
                }
                <div className={styles.info}>
                    {/* Shows a form to upload a child image */}
                    {isUploading ? <div className="App">
            <h2>Add Image:</h2>
            <p>Allowed files types are jpg, jpeg, and png. Image size must be less than 1MB.</p>
            <input type="file" onChange={handlePhotoUpload} />
            <button onClick={handlePhotoSubmit}>Save</button>
            <button onClick={() => setIsUploading(!isUploading)}>Cancel</button>
            {message && message.map( (msg, id) => <p className={styles.message} key={id}>{msg}</p>
        )}
        </div> : <img src={photo} alt="child's photo" />}
                    
                    <div>
                        <label>Address: <span>{child.address}</span></label>
                        <label>Parent/Guardian: <span>{childParent[0]?.first_name || curUser.first_name} {childParent[0]?.last_name || curUser.last_name}</span></label>
                        <label>Dob: <span>{child.dob}</span></label>
                        <label>Gender: <span>{child.gender}</span></label>
                        <label>Emergency Contact Name: <span>{child.em_contact_name}</span></label>
                        <label>Emergency Contact Phone: <span>{child.em_contact_number}</span></label>
                        <label>Notes: <span>{child.notes}</span></label>
                    </div>
                </div>
                {!isUploading &&<button onClick={() => setIsUploading(!isUploading)}>Upload</button>}
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
            {showAlert && <Alert severity={alertSeverity}>{alertMessage}</Alert>}
            {content}
        </>
    )
}

export default ChildDetails;