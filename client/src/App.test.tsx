import { render, screen } from '@testing-library/react';
import App from './App';

test('renders nutrition AI assistant', () => {
  render(<App />);
  const heading = screen.getByText(/Nutrition AI Assistant/i);
  expect(heading).toBeInTheDocument();
});
