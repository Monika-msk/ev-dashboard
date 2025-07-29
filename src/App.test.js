import { render, screen } from '@testing-library/react';
import App from './App';

test('renders map search input', () => {
  render(<App />);
  // Check for search input by placeholder text
  const searchInput = screen.getByPlaceholderText(/search corridor id, name, or site id/i);
  expect(searchInput).toBeInTheDocument();
});
