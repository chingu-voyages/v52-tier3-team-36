import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserDetails from './UserDetails';

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
    }),
  }));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn().mockReturnValue({
        pathname: '',
        search: 'value',
        hash: '',
        state: {
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
        ,
        key: '5nvxpbdafa',
    }),
}));

test('renders user details component', () => {
  render(<MemoryRouter><UserDetails /></MemoryRouter>);
  const labelElement = screen.getByText(/dave@kinderly.com/i);
  expect(labelElement).toBeInTheDocument();
});