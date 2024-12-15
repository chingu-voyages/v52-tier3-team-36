import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './Login';

jest.mock('../../contexts/useAuth', () => ({
    useAuth: () => ({loginUser: () => {}
  })}))
  
test('renders user self password change form', () => {
  render(<MemoryRouter><LoginPage/></MemoryRouter>);
  const labelElement = screen.getByLabelText(/Password/i);
  expect(labelElement).toBeInTheDocument();
});