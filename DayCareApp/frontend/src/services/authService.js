// services
import * as tokenService from './tokenService'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/auth`

function getUser() {
  return tokenService.getUserFromToken()
}

function logout() {
  tokenService.removeToken()
}

async function login(loginFormData) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginFormData),
    })
    const json = await res.json()

    if (json.err) throw new Error(json.err)

    if (json.token) tokenService.setToken(json.token)
  } catch (err) {
    throw new Error(err)
  }
}

export { getUser, logout, login }
