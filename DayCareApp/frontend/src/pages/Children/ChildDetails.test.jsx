import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChildDetails from './ChildDetails';

jest.mock('../../contexts/useAuth', () => ({
    useAuth: () => ({curUser: {
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
  })}))

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useEffect: jest.fn((f) => {
        [
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
    }),
  }));

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn().mockReturnValue({
        pathname: '',
        search: 'value',
        hash: '',
        state: {parents: [{
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
            }],
        child: {
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
        }}
        ,
        key: '5nvxpbdafa',
    }),
}));

test('renders child details component', () => {
  render(<MemoryRouter><ChildDetails /></MemoryRouter>);
  const labelElement = screen.getByText(/2024-12-05/i);
  expect(labelElement).toBeInTheDocument();
});