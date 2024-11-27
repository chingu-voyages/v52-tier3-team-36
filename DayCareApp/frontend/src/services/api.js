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
        const response = await axios.get(`${BASE_URL}/users`, { withCredentials: true});
        return response.data
    } catch(error) {
        return call_refresh (error, axios.get(`${BASE_URL}/users`, { withCredentials: true}), {
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