
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserEdit from './UserEdit';

const curUser = 	{
    "username": "testadminnew",
    "id": 12,
    "first_name": "Admin",
    "last_name": "New",
    "email": "adminnew@kinderly.com",
    "groups": [
        1
    ],
    "permissions": {
        "group": 1,
        "id": 7,
        "list_users": true,
        "edit_users": true,
        "edit_parents": true,
        "list_parents": true,
        "list_children": true,
        "edit_report_cards": true,
        "list_own_children": false,
        "edit_children": true,
        "check_in": true,
        "view_stats": true
    }
}
const userGroups = [
	{
		"url": "http://127.0.0.1:8000/groups/1/",
		"id": 1,
		"name": "Administrators"
	},
	{
		"url": "http://127.0.0.1:8000/groups/7/",
		"id": 7,
		"name": "Parents"
	},
	{
		"url": "http://127.0.0.1:8000/groups/2/",
		"id": 2,
		"name": "Staff"
	}
]
const user = 
	{
		"url": "http://127.0.0.1:8000/users/14/",
		"id": 14,
		"username": "testparentnew",
		"first_name": "Dave1",
		"last_name": "Parent",
		"email": "dave@kinderly.com",
		"is_active": true,
		"groups": [
			7
		]
	}

const handleEditing = () => {}
const handleSetUser = () => {}

test('renders user edit form', () => {
  render(<MemoryRouter><UserEdit curUser={curUser} user={user} userGroups={userGroups} edit={handleEditing} editedUser={handleSetUser}/></MemoryRouter>);
  const labelElement = screen.getByLabelText(/First name/i);
  expect(labelElement).toBeInTheDocument();
});