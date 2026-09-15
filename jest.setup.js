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
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
