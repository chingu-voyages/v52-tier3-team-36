import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChildrenList from './Children';

const children = [
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
]

test('renders children list', () => {
  render(<MemoryRouter><ChildrenList children={children}/></MemoryRouter>);
  const labelElement = screen.getByText(/Test1/i);
  expect(labelElement).toBeInTheDocument();
});