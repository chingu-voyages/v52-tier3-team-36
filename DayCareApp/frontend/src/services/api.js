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