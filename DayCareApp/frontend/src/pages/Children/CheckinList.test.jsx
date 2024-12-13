import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckinList from './CheckinList';


const user = {
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

const checkins = [
    {
        "url": "http://127.0.0.1:8000/checkin/11/",
        "id": 11,
        "child": 3,
        "checkin": "2024-12-02T15:48:17.762000Z",
        "checkout": "2024-12-02T15:48:19.009000Z",
        "checkin_staff": "testadmin",
        "checkout_staff": "testadmin",
        "report_card": null,
        "report_staff": null
    },
    {
        "url": "http://127.0.0.1:8000/checkin/6/",
        "id": 6,
        "child": 2,
        "checkin": "2024-12-01T21:18:47.872000Z",
        "checkout": "2024-12-01T21:19:55.324000Z",
        "checkin_staff": "testadmin",
        "checkout_staff": "testadmin",
        "report_card": null,
        "report_staff": null
    },
    {
        "url": "http://127.0.0.1:8000/checkin/4/",
        "id": 4,
        "child": 3,
        "checkin": "2024-12-01T18:48:58.713000Z",
        "checkout": null,
        "checkin_staff": "testadmin",
        "checkout_staff": null,
        "report_card": null,
        "report_staff": null
    },
    {
        "url": "http://127.0.0.1:8000/checkin/3/",
        "id": 3,
        "child": 3,
        "checkin": "2024-12-01T10:30:00Z",
        "checkout": "2024-12-01T17:30:00Z",
        "checkin_staff": "testadmin",
        "checkout_staff": "testadmin",
        "report_card": null,
        "report_staff": null
    }
]

const updateCheckins = () => {}

test('renders child checkins', () => {
  render(<MemoryRouter><CheckinList checkins={checkins} updateCheckins={updateCheckins} user={user}/></MemoryRouter>);
  const labelElement = screen.getAllByText("12/1/2024");
  expect(labelElement).toHaveLength(3);
});