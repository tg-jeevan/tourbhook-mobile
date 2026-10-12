import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Image, Text } from 'react-native';
import SplashScreen from './SplashScreen';
import { AppColors } from '../../../core/theme/colors';

describe('SplashScreen', () => {
  it('renders splash screen cleanly with the official Tour Bhook logo', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<SplashScreen />);
    });
    const root = renderer!.root;

    // Verify Image component is rendered
    const images = root.findAllByType(Image);
    expect(images.length).toBe(1);

    const logoImage = images[0];
    expect(logoImage.props.resizeMode).toBe('contain');
    expect(logoImage.props.accessibilityLabel).toBe('Tour Bhook Logo');

    // Verify logo styling constraints for official TB symbol mark
    const logoStyle = logoImage.props.style;
    expect(logoStyle.aspectRatio).toBe(1);
    expect(logoStyle.width).toBeGreaterThanOrEqual(100);
    expect(logoStyle.width).toBeLessThanOrEqual(140);
    expect(logoStyle.height).toBeGreaterThanOrEqual(100);
    expect(logoStyle.height).toBeLessThanOrEqual(140);
    expect(logoStyle.maxWidth).toBe(140);

    // Verify no redundant text titles exist on splash (symbol alone, no wordmark text)
    const textNodes = root.findAllByType(Text);
    expect(textNodes.length).toBe(0);
  });

  it('uses deep navy background color (#10243F)', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<SplashScreen />);
    });
    const root = renderer!.root;

    const safeArea = root.children[0] as ReactTestRenderer.ReactTestInstance;
    expect(safeArea.props.style.backgroundColor).toBe(AppColors.textPrimary);
    expect(AppColors.textPrimary).toBe('#10243F');
  });
});
