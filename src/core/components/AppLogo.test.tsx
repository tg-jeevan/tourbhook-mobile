import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Image, View } from 'react-native';
import { AppLogo } from './AppLogo';

describe('AppLogo Component', () => {
  it('renders official transparent logo image with contain mode and without background container', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AppLogo size="compact" />);
    });

    const root = renderer!.root;
    const images = root.findAllByType(Image);
    expect(images.length).toBe(1);

    const logoImg = images[0];
    expect(logoImg.props.resizeMode).toBe('contain');
    expect(logoImg.props.accessibilityLabel).toBe('Tour Bhook Official Logo');
    expect(logoImg.props.testID).toBe('tourbhook-transparent-logo');

    // Verify container has transparent background
    const container = root.findByType(View);
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'transparent' }),
      ])
    );
  });

  it('supports compact size for ProfileMenu', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AppLogo size="compact" />);
    });

    const logoImg = renderer!.root.findByType(Image);
    expect(logoImg.props.style).toEqual(
      expect.objectContaining({
        width: 110,
        height: 28,
      })
    );
  });

  it('supports header size for Onboarding and Welcome headers', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AppLogo size="header" />);
    });

    const logoImg = renderer!.root.findByType(Image);
    expect(logoImg.props.style).toEqual(
      expect.objectContaining({
        width: 120,
        height: 28,
      })
    );
  });

  it('supports large size with 2:1 aspect ratio for splash and hero views', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AppLogo size="large" />);
    });

    const logoImg = renderer!.root.findByType(Image);
    expect(logoImg.props.style).toEqual(
      expect.objectContaining({
        width: '100%',
        maxWidth: 320,
        aspectRatio: 2,
      })
    );
  });

  it('supports symbol variant with 1:1 aspect ratio for TB mark only', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AppLogo variant="symbol" size="symbol" />);
    });

    const logoImg = renderer!.root.findByType(Image);
    expect(logoImg.props.style).toEqual(
      expect.objectContaining({
        width: 120,
        height: 120,
        aspectRatio: 1,
      })
    );
    expect(logoImg.props.testID).toBe('tourbhook-symbol-logo');
    expect(logoImg.props.accessibilityLabel).toBe('Tour Bhook Symbol');
  });
});
