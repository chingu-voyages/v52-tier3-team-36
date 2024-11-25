// services
import * as tokenService from './tokenService'
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

function getUser() {
  return tokenService.getUserFromToken()
}

// function logout() {
//   tokenService.removeToken()
// }

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

export { getUser, login }
