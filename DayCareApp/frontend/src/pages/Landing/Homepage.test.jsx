import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Homepage from './Homepage';

jest.mock('../../contexts/useAuth', () => ({
    useAuth: () => ({curUser: null
  })}))

test('renders Landing if no user logged in', () => {
  render(<MemoryRouter><Homepage /></MemoryRouter>);
  const labelElement = screen.getByText(/Welcome to Kinderly/i);
  expect(labelElement).toBeInTheDocument();
});