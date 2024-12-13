import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

jest.mock('../../services/api', () => ({ getChildren: jest.fn().mockReturnValue([
    {
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
    },
    {
        "url": "http://127.0.0.1:8000/children/4/",
        "id": 4,
        "first_name": "Test1",
        "last_name": "Test",
        "notes": "N/A",
        "dob": "2024-12-04",
        "parent": 14,
        "gender": "FEMALE",
        "address": "22 Test Rd",
        "em_contact_name": "Dave",
        "em_contact_number": "222-222-2222",
        "upload": null
    }
]), 
    getUsers: jest.fn(), 
    getCheckedIn: jest.fn().mockReturnValue([]), 
    getParents: jest.fn() }))

const user = {
    "username": "testparent",
    "id": 14,
    "first_name": "Parent",
    "last_name": "New",
    "email": "parentnew@kinderly.com",
    "groups": [
        3
    ],
    "permissions": {
        "group": 1,
        "id": 7,
        "list_users": false,
        "edit_users": false,
        "edit_parents": false,
        "list_parents": false,
        "list_children": false,
        "edit_report_cards": false,
        "list_own_children": true,
        "edit_children": false,
        "check_in": false,
        "view_stats": false
    }
}

test('renders children list', async () => {
  await act (async ()=> {render(<MemoryRouter><Dashboard curUser={user}/></MemoryRouter>)});
  const labelElement = screen.getByText(/Test1/i);
  await waitFor(() => {expect(labelElement).toBeInTheDocument()});
});