// src/App.test.jsx
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import NavBar from './NavBar';
import { MemoryRouter } from 'react-router-dom';

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

test('renders learn react link', () => {
  render(<MemoryRouter><NavBar /></MemoryRouter>);
  const linkElement = screen.getByText(/Kinderly/i);
  expect(linkElement).toBeInTheDocument();
});