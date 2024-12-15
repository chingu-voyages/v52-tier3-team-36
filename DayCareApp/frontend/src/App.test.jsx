import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

  
test('renders welcome page', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  const labelElement = screen.getByText(/Welcome to Kinderly/i);
  expect(labelElement).toBeInTheDocument();
});