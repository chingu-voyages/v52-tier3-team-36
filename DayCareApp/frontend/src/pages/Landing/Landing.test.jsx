import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing';


test('renders landing page component', () => {
  render(<MemoryRouter><Landing/></MemoryRouter>);
  const labelElement = screen.getByText(/Welcome to Kinderly/i);
  expect(labelElement).toBeInTheDocument();
});