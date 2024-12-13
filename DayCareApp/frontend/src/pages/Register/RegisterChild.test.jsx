import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterChildPage from './RegisterChild';

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
            }]}
        ,
        key: '5nvxpbdafa',
    }),
}));

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
  
test('renders child registration form', () => {
  render(<MemoryRouter><RegisterChildPage /></MemoryRouter>);
  const labelElement = screen.getByLabelText(/Name of emergency contact/i);
  expect(labelElement).toBeInTheDocument();
});