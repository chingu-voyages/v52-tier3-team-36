import axios from 'axios';
import { call_refresh } from './authService';
// Backend base URL
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`
// Gets and returns a list of groups from backend
export const getGroups = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/groups`, { withCredentials: true});
        return response.data
    } catch(error) {
        // Calls the API again using call_refresh that refreshes the token if the access one has expired
        return call_refresh (error, axios.get(`${BASE_URL}/groups`, { withCredentials: true}), {
            withCredentials: true
        })
    }
}
// Gets and returns a list of users from the backend
export const getUsers = async ({params}) => {
    try {
        const response = await axios.get(`${BASE_URL}/staff`, 
            { params: params, 
            withCredentials: true});
        return response.data
    } catch(error) {
        // Calls the API again using call_refresh that refreshes the token if the access one has expired
        return call_refresh (error, axios.get(`${BASE_URL}/staff`, { withCredentials: true}), {
            withCredentials: true
        })
    }
}
// Gets and returns a list of children from the backend
export const getChildren = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/children`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        // Calls the API again using call_refresh that refreshes the token if the access one has expired
        return call_refresh (error, axios.get(`${BASE_URL}/children`, {
            withCredentials: true
        }))
    }
}
// Gets and returns a list of parents from the backend
export const getParents = async ({params}) => {
    try {
        const response = await axios.get(`${BASE_URL}/parents`, {
            params: params,
            withCredentials: true
        })
        return response.data
    } catch (error){
        // Calls the API again using call_refresh that refreshes the token if the access one has expired
        return call_refresh (error, axios.get(`${BASE_URL}/parents`, {
            withCredentials: true
        })
    )
    }
}
/* Posts form data to the backend to register a new child. 
Expects the following child data:
"first_name": string,
"last_name": string,
"notes": string,
"dob": date YYYY-MM-DD,
"gender": MALE/FEMALE/NOT/OTHER,
"address": string,
"em_contact_name": string,
"em_contact_number": string,
"parent": int for parent ID */
export const registerChild = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/children/`, 
            formData, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        // Calls the API again using call_refresh that refreshes the token if the access one has expired
        return call_refresh (error, axios.post(`${BASE_URL}/children/`, 
            formData, {
            withCredentials: true
        }))
    }
}
/* Patch request to backend API to edit generic record
depending on URL - user/child parent editing.
The url has to be passed as an argument
*/
export const editRecord = async (formData, url) => {
    try {
        const response = await axios.patch(url, 
            formData
        , {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.patch(url, 
            formData
        , {
            withCredentials: true
        }))
    }
}

export const uploadImage = async (formData, url) => {
    try {
        const response = await axios.patch(url, 
            formData
        , {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.patch(url, 
            formData
        , {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        }))
    }
}
/* Get all cehckins for a child between the first of the current month and today.
Also, can receive optional from-to date range for filtering.
*/
export const getCheckins = async (formData) => {
    const today = new Date()
    const todayJSON = today.toJSON().slice(0, 10);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toJSON().slice(0,10);
    const from_default = formData.child && !formData.from ? firstDayOfMonth : todayJSON;
    const params = {
        "child": formData.child,
        "from": formData.from || from_default,
        "to": formData.to
    }
    try {
        const response = await axios.get(`${BASE_URL}/checkin`,
         {
            params: params,
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.get(`${BASE_URL}/checkin`,
        {
            params: params,
            withCredentials: true
        })
    )
    }
}
// Post child checkin - expects the child ID and staff ID
export const postCheckin = async (child, checkin_staff) => {
    const today = new Date().toJSON();
    try {
        const response = await axios.post(`${BASE_URL}/checkin/`, {
            "checkin": today,
            "child": child,
            "checkin_staff": checkin_staff
        } , {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.post(`${BASE_URL}/checkin/`, {
            "checkin": today,
            "child": child,
            "checkin_staff": checkin_staff
        } , {
            withCredentials: true
        })
    )
}
}
// Post child checkou - expects child ID and staff ID
export const postCheckout = async (checkin, checkout_staff) => {
    const today = new Date().toJSON();
    try {
        const response = await axios.patch(`${BASE_URL}/checkin/${checkin}/`, {
            "checkout": today,
            "checkout_staff": checkout_staff
        } , {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.patch(`${BASE_URL}/checkin/`, {
            "checkout": today,
            "checkout_staff": checkout_staff
        } , {
            withCredentials: true
        })
    )
}
}
// Post report card for child - expects checkin ID, staff ID, and the text for the report card.
export const postReportCard = async (report_text, report_staff, checkin) => {
    try {
        const response = await axios.patch(`${BASE_URL}/checkin/${checkin}/`, {
            "report_card": report_text,
            "report_staff": report_staff
        } , {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.patch(`${BASE_URL}/checkin/${checkin}/`, {
            "report_card": report_text,
            "report_staff": report_staff
        } , {
            withCredentials: true
        })
    )
}
}
// Get a list of the currently checked in children
export const getCheckedIn = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/checkedin`, {
            withCredentials: true
        })
        return response.data
    } catch (error){
        return call_refresh (error, axios.get(`${BASE_URL}/checkedin`, {
            withCredentials: true
        })
    )
    }
}