
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChildEdit from './ChildEdit';


const child = 	{
    "url": "http://127.0.0.1:8000/children/5/",
    "id": 5,
    "first_name": "New",
    "last_name": "Child",
    "notes": "",
    "dob": "2024-12-05",
    "parent": 14,
    "gender": "MALE",
    "address": "3434",
    "em_contact_name": "Dave1 parent",
    "em_contact_number": "222-222-2222",
    "upload": null
}
const parents = [
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
]
const childParent = [
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
]
const handleEditing = () => {}
const handleSetChild = () => {}

test('renders child edit form', () => {
  render(<MemoryRouter><ChildEdit child={child} parents={parents} childParent={childParent} edit={handleEditing} editedChild={handleSetChild}/></MemoryRouter>);
  const labelElement = screen.getByLabelText(/First name/i);
  expect(labelElement).toBeInTheDocument();
});