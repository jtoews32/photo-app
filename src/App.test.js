import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn Photo App', () => {
  render(<App />);
  const linkElement = screen.getByText(/Photo App/i);
  expect(linkElement).toBeInTheDocument();
});
