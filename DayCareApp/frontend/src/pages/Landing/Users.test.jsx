import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersList from './Users';

const users = [
	{
		"url": "http://127.0.0.1:8000/users/15/",
		"id": 15,
		"username": "teststaffnew",
		"first_name": "Dave",
		"last_name": "Staff",
		"email": "dfd@kinderly.com",
		"is_active": true,
		"groups": [
			2
		]
	},
	{
		"url": "http://127.0.0.1:8000/users/13/",
		"id": 13,
		"username": "testadmin1",
		"first_name": "fdfdfg",
		"last_name": "fdfd",
		"email": "fdf@dfd.com",
		"is_active": true,
		"groups": [
			1
		]
	}
]

test('renders staff list', () => {
  render(<MemoryRouter><UsersList users={users}/></MemoryRouter>);
  const labelElement = screen.getByText(/Dave/i);
  expect(labelElement).toBeInTheDocument();
});