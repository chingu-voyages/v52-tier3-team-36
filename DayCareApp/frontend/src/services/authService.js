// services
import axios from 'axios';
// Backend server base URL
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

// Send a request to logout a user
async function logout() {
  try{ 
    const response = await axios.post(`${BASE_URL}/api/logout/`, {}, {withCredentials: true})
    return true
  } catch(error) {
    return false
  }
}
// Send a request to log in a user. Returns success true/false
async function login(loginFormData) {
  try {
    const res = await axios.post(`${BASE_URL}/api/token/`, 
      loginFormData, { withCredentials: true})
    return res.data.success
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

/* Funciton to call the refresh_token call if status is 401/possibly expired token
 Takes in error and the function that needs to be retried */
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
/* Post user registration data to backend.
Expects the following:
{
    'username': string,
    'password': string,
    'confirm_password': string,
    'first_name': string,
    'last_name': string,
    'email': string,
    'groups': array of group IDs
  }
*/
async function register(registerFormData){
  const response = await axios.post(`${BASE_URL}/api/register/`, registerFormData, { withCredentials: true})
  return response.data
}
/* Post change password to backend.
Expects:
{
	"new_password": string,
	"old_password": string,
	"username": string
}
*/
const changePass = async (formData) => {
  try {
      const response = await axios.post(`${BASE_URL}/api/change-password/`,
          formData
      , {
          withCredentials: true
      })
      return response.data
  } catch (error) {
      return call_refresh (error, axios.post(`${BASE_URL}/api/change-password/`, 
          formData
      , {
          withCredentials: true
      }))
  }
}
/* Post reset password to backend.
Expects:
{
	"new_password": string,
	"username": string
}
*/
const adminResetPass = async (formData) => {
  try {
      const response = await axios.post(`${BASE_URL}/api/reset-password/`,
          formData
      , {
          withCredentials: true
      })
      return response.data
  } catch (error) {
      return call_refresh (error, axios.post(`${BASE_URL}/api/reset-password/`, 
          formData
      , {
          withCredentials: true
      }))
  }
}
// Get the permission for the group. Expects a group ID.
export const getGroupPermissions = async (id) => {
  const params = {
      "group": id,
  }
  try {
      const response = await axios.get(`${BASE_URL}/permissions`,
       {
          params: params,
          withCredentials: true
      })
      return response.data
  } catch (error) {
      return call_refresh (error, await axios.get(`${BASE_URL}/permissions`,
        {
           params: params,
           withCredentials: true
       })
  )
  }
}
/* Patch group permissions. Expects the name of group if changed, and the permissions:
  'name': string
{
	"list_users": boolean,
  "edit_users": boolean,
  "edit_parents": boolean,
  "list_children": boolean,
  "list_own_children": boolean,
  "edit_children": boolean,
  "check_in": boolean,
	"view_stats": boolean,
	"list_parents": boolean,
	"edit_report_cards": boolean,
	"group": int,
	"id": int
}
  */
export const editGroupPermissions = async (permissions, name) => {
      const submitRequest = async () => {
        const groupEditResponse = await axios.patch(`${BASE_URL}/groups/${permissions.group}/`,
          {"name": name},
         {
            withCredentials: true
        })
        if(groupEditResponse){
          await axios.patch(`${BASE_URL}/permissions/${permissions.id}/`,
            permissions,
           {
              withCredentials: true
          })
        }
        return true
      };
  try {
      await submitRequest()
      return {"success": true}
  } catch (error) {
      return call_refresh (error, await submitRequest()
    )
  }
}
/* Post add new group. the name of group and the permissions:
  'name': string
{
	"list_users": boolean,
  "edit_users": boolean,
  "edit_parents": boolean,
  "list_children": boolean,
  "list_own_children": boolean,
  "edit_children": boolean,
  "check_in": boolean,
	"view_stats": boolean,
	"list_parents": boolean,
	"edit_report_cards": boolean,
	"group": int,
	"id": int
}*/
export const addGroup = async (permissions, name) => {
  const submitRequest = async () => {
    const groupAddResponse = await axios.post(`${BASE_URL}/groups/`,
      {"name": name},
     {
        withCredentials: true
    })
    if(groupAddResponse){
      try {
      permissions.group = groupAddResponse.data.id
      const permAddResponse = await axios.post(`${BASE_URL}/permissions/`,
        permissions,
       {
          withCredentials: true
      })
    } catch(error) {
      await axios.delete(`${BASE_URL}/groups/${groupAddResponse.data.id}`)
    }
    return groupAddResponse.data
  }
  };
try {
  const response = await submitRequest()
  return response
} catch (error) {
  return call_refresh (error, await submitRequest()
)
}
}
// Deletes a group. Expects the group ID. Returns success true/false
export const deleteGroup = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/groups/${id}/`,
      { withCredentials: true }
    )
    return {"success": true}
  } catch (error) {
    return call_refresh (error, await axios.delete(`${BASE_URL}/groups/${id}/`,
      { withCredentials: true }
    )
  )
  }
  }

/* Checks to see if a user is authenticated. Returns a user object:
{
	"authenticated": {
		"username": string,
		"id": int,
		"first_name": string,
		"last_name": string,
		"email": string,
		"groups": [
			int, ...
		],
		"permissions": {
			"group": int,
			"id": int,
			"list_users": boolean,
			"edit_users": boolean,
			"edit_parents": boolean,
			"list_parents": boolean,
			"list_children": boolean,
			"edit_report_cards": boolean,
			"list_own_children": fboolean,
			"edit_children": boolean,
			"check_in": boolean,
			"view_stats": boolean
		}
	}
}
*/
async function isAuth() {
  try {
    const success = await axios.post(`${BASE_URL}/api/authenticated/`, {}, {withCredentials: true});
    return success.data.authenticated;
  } catch(error){
    return false;
  }
}
export { login, logout, refresh_token, call_refresh, register, adminResetPass, changePass, isAuth }
