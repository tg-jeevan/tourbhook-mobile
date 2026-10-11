/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  jest.useFakeTimers();
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
    jest.advanceTimersByTime(2000);
  });
  jest.useRealTimers();
});
