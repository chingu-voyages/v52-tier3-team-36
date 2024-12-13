import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ParentsList from './Parents';

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

test('renders parents list', () => {
  render(<MemoryRouter><ParentsList parents={parents}/></MemoryRouter>);
  const labelElement = screen.getByText(/Dave1/i);
  expect(labelElement).toBeInTheDocument();
});