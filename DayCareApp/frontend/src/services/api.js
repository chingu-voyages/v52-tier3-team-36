import axios from 'axios';
import { call_refresh } from './authService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

export const getGroups = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/groups`, { withCredentials: true});
        return response.data
    } catch(error) {
        return call_refresh (error, axios.get(`${BASE_URL}/groups`, { withCredentials: true}), {
            withCredentials: true
        })
    }
}

export const getUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/staff`, { withCredentials: true});
        return response.data
    } catch(error) {
        return call_refresh (error, axios.get(`${BASE_URL}/staff`, { withCredentials: true}), {
            withCredentials: true
        })
    }
}

export const getChildren = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/children`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.get(`${BASE_URL}/children`, {
            withCredentials: true
        }))
    }
}

export const getParents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/parents`, {
            withCredentials: true
        })
        return response.data
    } catch (error){
        return call_refresh (error, axios.get(`${BASE_URL}/parents`, {
            withCredentials: true
        })
    )
    }
}

export const registerChild = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/children/`, {
            "first_name": formData.first_name,
            "last_name": formData.last_name,
            "notes": formData.notes,
            "dob": formData.dob,
            "gender": formData.gender,
            "address": formData.address,
            "em_contact_name": formData.em_contact_name,
            "em_contact_number": formData.em_contact_number,
            "parent": formData.parent
        }, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return call_refresh (error, axios.post(`${BASE_URL}/children/`, {
            "first_name": formData.first_name,
            "last_name": formData.last_name,
            "notes": formData.notes,
            "dob": formData.dob,
            "gender": formData.gender,
            "address": formData.address,
            "em_contact_name": formData.em_contact_name,
            "em_contact_number": formData.em_contact_number,
            "parent": formData.parent
        }, {
            withCredentials: true
        }))
    }
}

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