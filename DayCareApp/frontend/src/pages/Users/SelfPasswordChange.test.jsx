
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SelfPasswordChange from './SelfPasswordChange';

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

const handleIsChangingPass = () => {}

test('renders user self password change form', () => {
  render(<MemoryRouter><SelfPasswordChange user={user} edit={handleIsChangingPass}/></MemoryRouter>);
  const labelElement = screen.getByLabelText(/Current password/i);
  expect(labelElement).toBeInTheDocument();
});