import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './Register';

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
  
test('renders user registration form', () => {
  render(<MemoryRouter><RegisterPage/></MemoryRouter>);
  const labelElement = screen.getByLabelText(/Confirm password/i);
  expect(labelElement).toBeInTheDocument();
});