// services
// import * as tokenService from './tokenService'
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

// function getUser() {
//   return tokenService.getUserFromToken()
// }

async function logout() {
  try{ 
    const response = await axios.post(`${BASE_URL}/api/logout/`, {}, {withCredentials: true})
    return true
  } catch(error) {
    return false
  }
}

async function login(loginFormData) {
  try {
    const res = await axios.post(`${BASE_URL}/api/token/`, {
      'username': loginFormData.username,
      'password': loginFormData.password
    }, { withCredentials: true})

    return res.data
  } catch (err) {
    throw new Error(err)
  }
}

// Function to refresh the access token if expired
async function refresh_token() {
  try {
    const response = await axios.post(`${BASE_URL}/api/token/refresh/`, 
      {},
      {withCredentials: true}
    )
    // Should return a JSON with status "refreshed"
    return response.data.refreshed
  } catch (error) {
    return false
  }

}

// Funciton to call the refresh_token call if status is 401/possibly expired token
// Takes in error and the function that needs to be retried
async function call_refresh(error, func) {
  if(error.response && error.response.status === 401) {
    const tokenRefreshed = await refresh_token();
    if(tokenRefreshed) {
      const retryResponse = await func();
      return retryResponse.data;
    }
  }
  return false
}

async function register(registerFormData){
  const response = axios.post(`${BASE_URL}/api/register/`, {
    'username': registerFormData.username,
    'password': registerFormData.password,
    'confirm_password': registerFormData.confirm_password,
    'first_name': registerFormData.first_name,
    'last_name': registerFormData.last_name,
    'email': registerFormData.email,
    'groups': registerFormData.groups
  }, { withCredentials: true})
  return response.data
}

// Checks to see if a user is authenticated
async function isAuth() {
  try {
    await axios.post(`${BASE_URL}/api/authenticated/`, {}, {withCredentials: true});
    return true;
  } catch(error){
    return false;
  }
}
export { login, logout, refresh_token, call_refresh, register, isAuth }
