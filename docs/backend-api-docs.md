# Backend API documentation

## Authentication
### App: app_auth
Endpoint: /api

#### User login: /token/
Creates and returns an HTTP-only cookie with access and refresh tokens
**HTTPS Methods**: POST
**Parameters**:
Required:
- "username" - string
- "password" - string

**URL request example**:
https://{base_url}/api/token/
Request body JSON:
```json
{
 "username": "user_username",
 "password": "user_password"
}
```
Response - success:
```json
{
	"success": true,
	"user": {
		"username": "user_username",
		"first_name": "user_first_name",
		"last_name": "user_last_name",
		"email": "user_email@kinderly.com",
        "is_active": true,
		"groups": [
			group_id, ...
		]
	}
}
```
Response - failure:
```json
{
	"success": false
}
```
#### Refresh token: /token/refresh/
Expects a cookie with a valid access token, re-issues a new cookie with the updated tokens 
**HTTPS Methods**: POST

**URL request example**:
https://{base_url}/api/token/refresh/


Response - success:
```json
{
    "refreshed": true
}
```
Response - failure:
```json
{
    "refreshed": false
}
```
#### User logout: /logout/
**HTTPS Methods**: POST

**URL request example:**
https://{base_url}/api/logout/

Response:
```json
{
	"success": true
}
```
#### User registration: /register/
**HTTPS Methods:** POST
**Parameters**:
Required:
- "username" - string, unique
- "password" - string
Optional:
- "email" - string
- "first_name" - string
- "last_name" - string
- "groups" - array of int

**URL request example:**
https://{base_url}/api/register/

Request body JSON:
```json
{
	"username": "user_username",
	"password": "user_password",
	"email": "user_email@kinderly.com",
	"first_name": "user_first_name",
	"last_name": "user_last_name",
	"groups": [
        group_id, ...
    ]
}
```
Response - success:
```json
{
	"username": "user_username",
	"email": "user_email@kinderly.com",
	"first_name": "user_first_name",
	"last_name": "user_last_name",
    "is_active": true,
	"groups": [
        group_id, ...
    ]
}
```
Response - failure:
```json
{
	"username": [
		"A user with that username already exists."
	]
}
```
#### User password change: /change-password/
**HTTPS Methods:** POST
**Parameters**:
Required:
- "new_password" - string
- "old_password" - string

**URL request example:**
https://{base_url}/api/change-password/

Request body JSON:
```json
{
    "new_password": "new_user_password",
    "old_password": "current_user_password"
}
```
Response - success:
```json
{
	"message": "Password updated successfully"
}
```
Response - failure:
```json
{
	"old_password": [
		"Wrong password."
	]
}
```
## User operations
### App: app_auth
Endpoint: /users

#### Get all users: /
**HTTPS Methods:** GET

**URL request example:**
https://{base_url}/users

Response - success:
```json
[
	{
		"url": "https://{base_url}/users/{user_id}/",
		"id": 8,
		"username": "user_username",
		"first_name": "user_first_name",
		"last_name": "user_last_name",
		"email": "user_email@kinderly.com",
        "is_active": true,
		"groups": [
			"https://{base_url}/groups/{group_id}/"
		]
	}, 
    {
        ...
    }
]
```
#### Get specific user: /{user_id}
**HTTPS Methods:** GET

**URL request example:**
https://{base_url}/users/{user_id}

Response - success:
```json
{
		"url": "https://{base_url}/users/{user_id}/",
		"id": 8,
		"username": "user_username",
		"first_name": "user_first_name",
		"last_name": "user_last_name",
		"email": "user_email@kinderly.com",
        "is_active": true,
		"groups": [
			"https://{base_url}/groups/{group_id}/"
		]
}
```
Response - failure:
```json
{
	"detail": "No User matches the given query."
}
```
#### Update user contact information: /{user_id}/
**HTTPS Methods:** PATCH
**Parameters**:
Optional:
- "first_name" - string
- "last_name" - string
- "email" - string
- "is_active" - boolean

**URL request example:**
https://{base_url}/users/{user_id}/

Request body JSON:
```json
{
    "first_name": "new_first_name",
    "last_name": "new_last_name",
    "email": "new_email",
    "is_active": false
}
```
Response - success:
```json
{
		"url": "https://{base_url}/users/{user_id}/",
		"id": 8,
		"username": "user_username",
		"first_name": "new_user_first_name",
		"last_name": "new_user_last_name",
		"email": "new_user_email@kinderly.com",
        "is_active": false,
		"groups": [
			"https://{base_url}/groups/{group_id}/"
		]
}
```
#### User delete: /{user_id}/
**HTTPS Methods:** DELETE

**URL request example:**
https://{base_url}/users/{user_id}/


Response - success:
Status code: 204
Response - failure:
```json
{
	"detail": "No User matches the given query."
}
```
## Group operations
### App: app_auth
Endpoint: /groups

#### Get all groups: /
**HTTPS Methods:** GET

**URL request example:**
https://{base_url}/groups

Response - success:
```json
[
	{
		"url": "http://127.0.0.1:8000/groups/1/",
		"id": 1,
		"name": "Administrators"
	},
	{
		"url": "http://127.0.0.1:8000/groups/3/",
		"id": 3,
		"name": "Parents"
	},
	{
		"url": "http://127.0.0.1:8000/groups/2/",
		"id": 2,
		"name": "Staff"
	}
]
```