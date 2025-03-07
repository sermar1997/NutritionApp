# Testing Strategy for Nutrition App

This directory contains test utilities and helpers for the Nutrition App project. 

## Overview

We use the following testing stack:
- **Vitest**: For running tests and assertions
- **React Testing Library**: For testing React components
- **Jest DOM**: For DOM-related assertions
- **User Event**: For simulating user interactions

## Test Structure

The project follows a typical testing structure with:

1. **Unit Tests**: For testing individual components and functions in isolation.
2. **Integration Tests**: For testing how multiple components work together.
3. **Feature Tests**: For testing complete user flows and features.

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/common/Button.test.tsx

# Run tests in watch mode
npm test -- --watch
```

## Test Utilities

- `test-utils.tsx`: Custom render method that wraps components with all necessary providers.
- `setup.ts`: Global test setup, including mocked browser APIs.

## Best Practices

1. **Write Descriptive Test Names**: Test names should describe the expected behavior.
2. **Use Selectors Wisely**: Prefer querying by role, text, or test ID.
3. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it.
4. **Avoid Testing Styling**: Don't test styling unless it's critical to functionality.
5. **Keep Tests Independent**: Each test should be able to run in isolation.
6. **Clean Up After Tests**: Reset mocks and cleanup DOM between tests.
7. **Use Act When Necessary**: Wrap state updates in `act()` when needed.

## Common Patterns

### Testing Components with State

```tsx
it('updates state when button is clicked', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  
  fireEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Testing Asynchronous Code

```tsx
it('fetches and displays data', async () => {
  render(<DataFetcher />);
  
  // Wait for loading state to complete
  await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  
  // Check if data is displayed
  expect(screen.getByText('Data item 1')).toBeInTheDocument();
});
```

### Testing Context Providers

```tsx
it('provides context values to consumers', () => {
  const TestConsumer = () => {
    const value = useMyContext();
    return <div data-testid="value">{value}</div>;
  };
  
  render(
    <MyContextProvider initialValue="test">
      <TestConsumer />
    </MyContextProvider>
  );
  
  expect(screen.getByTestId('value')).toHaveTextContent('test');
});
```
