/* eslint-disable no-undef */

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = props => React.createElement(View, props, props.children);
  const MockMarker = props => React.createElement(View, props, props.children);
  const MockPolyline = props => React.createElement(View, props, props.children);
  const MockCallout = props => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polyline: MockPolyline,
    Callout: MockCallout,
    PROVIDER_GOOGLE: 'google',
    PROVIDER_DEFAULT: 'default',
  };
});

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key, value) => {
        store.set(key, String(value));
        return Promise.resolve(null);
      }),
      getItem: jest.fn(key => {
        return Promise.resolve(store.has(key) ? store.get(key) : null);
      }),
      removeItem: jest.fn(key => {
        store.delete(key);
        return Promise.resolve(null);
      }),
      clear: jest.fn(() => {
        store.clear();
        return Promise.resolve(null);
      }),
      setMany: jest.fn(entries => {
        Object.entries(entries).forEach(([k, v]) => store.set(k, String(v)));
        return Promise.resolve(null);
      }),
      getMany: jest.fn(keys => {
        const result = {};
        keys.forEach(k => {
          result[k] = store.has(k) ? store.get(k) : null;
        });
        return Promise.resolve(result);
      }),
      removeMany: jest.fn(keys => {
        keys.forEach(k => store.delete(k));
        return Promise.resolve(null);
      }),
    },
  };
});

