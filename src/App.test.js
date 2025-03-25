import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header with title', () => {
  render(<App />);
  const titleElement = screen.getByText(/WeatherNow/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Enter city name/i);
  expect(searchInput).toBeInTheDocument();
});

test('renders footer copyright', () => {
  render(<App />);
  const footerText = screen.getByText(/Developed with ❤️/i);
  expect(footerText).toBeInTheDocument();
});