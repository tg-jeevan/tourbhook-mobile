import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Linking, Alert, Clipboard } from 'react-native';
declare const require: any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');
import HelpSupportScreen, {
  SUPPORT_EMAIL,
  SUPPORT_PHONE_RAW,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_EMAIL_SUBJECT,
  getEmailBody,
  getWhatsAppMessage,
  getEmailUrl,
  getWebmailUrl,
  getWhatsAppUrls,
  copyToClipboard,
} from './HelpSupportScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
let mockUser: { name?: string; email?: string } | null = {
  name: 'Aarav Sharma',
  email: 'aarav@test.com',
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));

jest.mock('../../../core/auth/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('HelpSupportScreen — Email & WhatsApp Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = {
      name: 'Aarav Sharma',
      email: 'aarav@test.com',
    };
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('1. Pure URL, Message formatting and Clipboard helpers', () => {
    it('uses correct support email and subject', () => {
      expect(SUPPORT_EMAIL).toBe('hello.tourbhook@gmail.com');
      expect(SUPPORT_EMAIL_SUBJECT).toBe('Tourbhook App Support');
    });

    it('populates authenticated user name in email body', () => {
      const body = getEmailBody('Aarav Sharma');
      expect(body).toContain('Heyy, I am Aarav Sharma.');
      expect(body).toContain('I need your assistance with the Tourbhook Application.');
      expect(body).toContain('Issue/Query:');
      expect(body).toContain('[Please describe how we can help you.]');
      expect(body).toContain('Thank you.');
    });

    it('falls back to [Your Name] placeholder in email body when user name is missing', () => {
      const bodyEmpty = getEmailBody('');
      expect(bodyEmpty).toContain('Heyy, I am [Your Name].');

      const bodyUndefined = getEmailBody(undefined);
      expect(bodyUndefined).toContain('Heyy, I am [Your Name].');
    });

    it('correctly constructs encoded mailto URL', () => {
      const url = getEmailUrl('Aarav Sharma');
      expect(url.startsWith('mailto:hello.tourbhook@gmail.com?')).toBe(true);
      expect(url).toContain(`subject=${encodeURIComponent('Tourbhook App Support')}`);
      expect(url).toContain(encodeURIComponent('Heyy, I am Aarav Sharma.'));
    });

    it('correctly constructs webmail compose URL', () => {
      const webmailUrl = getWebmailUrl('Aarav Sharma');
      expect(webmailUrl.startsWith(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}`)).toBe(true);
      expect(webmailUrl).toContain(`su=${encodeURIComponent('Tourbhook App Support')}`);
      expect(webmailUrl).toContain(encodeURIComponent('Heyy, I am Aarav Sharma.'));
    });

    it('uses correct international WhatsApp number without plus in URL', () => {
      expect(SUPPORT_PHONE_RAW).toBe('919986474527');
      expect(SUPPORT_PHONE_DISPLAY).toBe('+91 99864 74527');
    });

    it('populates authenticated user name in WhatsApp message and encodes correctly', () => {
      const msg = getWhatsAppMessage('Aarav Sharma');
      expect(msg).toBe('Heyy, I am Aarav Sharma. I need your assistance with the Tourbhook Application.');

      const { directUrl, webUrl } = getWhatsAppUrls('Aarav Sharma');
      expect(directUrl).toBe(`whatsapp://send?phone=919986474527&text=${encodeURIComponent(msg)}`);
      expect(webUrl).toBe(`https://wa.me/919986474527?text=${encodeURIComponent(msg)}`);
    });

    it('falls back to [Your Name] in WhatsApp message when user name is missing', () => {
      const msg = getWhatsAppMessage(undefined);
      expect(msg).toBe('Heyy, I am [Your Name]. I need your assistance with the Tourbhook Application.');
    });

    it('copies text to clipboard safely', () => {
      const copySpy = jest.spyOn(Clipboard, 'setString');
      const res = copyToClipboard('Test copy text');
      expect(res).toBe(true);
      expect(copySpy).toHaveBeenCalledWith('Test copy text');
    });
  });

  describe('2. Component UI and Interaction', () => {
    it('renders the header, banner, and both support cards', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      // Banner text
      expect(root.findAllByProps({ children: 'Need a hand?' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Our support team is ready to help.' }).length).toBeGreaterThan(0);
      expect(
        root.findAll((node) => typeof node.props.children === 'string' && node.props.children.includes('11 AM to 7 PM')).length
      ).toBeGreaterThan(0);

      // Email Card
      expect(root.findAllByProps({ children: 'Email Support' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Send Email' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Need help with Tourbhook? Send our team a message.' }).length).toBeGreaterThan(0);

      // Live Chat Card
      expect(root.findAllByProps({ children: 'Live Chat' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Chat with us on WhatsApp Business' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Chat on WhatsApp' }).length).toBeGreaterThan(0);

      // Contact details must NOT be visible anywhere on the screen
      expect(root.findAllByProps({ children: 'hello.tourbhook@gmail.com' }).length).toBe(0);
      expect(root.findAllByProps({ children: '+91 99864 74527' }).length).toBe(0);
      expect(root.findAllByProps({ children: '919986474527' }).length).toBe(0);
    });

    it('does not display any contact details in visible text but constructs expected redirect URLs', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true as never);
      const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);

      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      // Verify no rendered text contains raw contact info, asterisks, or masked details
      const allTextNodes = root.findAll((node) => typeof node.props.children === 'string');
      const renderedStrings = allTextNodes.map((n) => n.props.children as string);
      expect(renderedStrings.some((s) => s.includes('hello.tourbhook@gmail.com'))).toBe(false);
      expect(renderedStrings.some((s) => s.includes('99864'))).toBe(false);
      expect(renderedStrings.some((s) => s.includes('***'))).toBe(false);

      // Verify Send Email button/card opens expected email URL with prefilled user data
      const emailCard = root.findByProps({ testID: 'email-support-card' });
      await ReactTestRenderer.act(async () => {
        await emailCard.props.onPress();
      });
      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('mailto:hello.tourbhook@gmail.com?subject=Tourbhook%20App%20Support&body=Heyy%2C%20I%20am%20Aarav%20Sharma')
      );

      // Verify Chat on WhatsApp button/card opens expected WhatsApp conversation URL
      const whatsappCard = root.findByProps({ testID: 'whatsapp-support-card' });
      await ReactTestRenderer.act(async () => {
        await whatsappCard.props.onPress();
      });
      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('whatsapp://send?phone=919986474527&text=Heyy%2C%20I%20am%20Aarav%20Sharma')
      );
    });

    it('launches email client when Email Support card is pressed and app is available', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true as never);
      jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);

      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      const emailCard = root.findByProps({ testID: 'email-support-card' });
      await ReactTestRenderer.act(async () => {
        await emailCard.props.onPress();
      });

      expect(Linking.canOpenURL).toHaveBeenCalledWith(expect.stringContaining('mailto:hello.tourbhook@gmail.com'));
      expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('mailto:hello.tourbhook@gmail.com'));
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('provides actionable fallback (webmail & copy) when device has no email app available', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false as never);
      jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('No email app') as never);

      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      const emailCard = root.findByProps({ testID: 'email-support-card' });
      await ReactTestRenderer.act(async () => {
        await emailCard.props.onPress();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Unable to Open Email',
        expect.stringContaining('No compatible email application was found'),
        expect.arrayContaining([
          expect.objectContaining({ text: 'Open Webmail' }),
          expect.objectContaining({ text: 'Copy Email & Message' }),
          expect.objectContaining({ text: 'Cancel' }),
        ])
      );

      // Verify Open Webmail action opens webmail compose page
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const webmailButton = buttons.find((b: any) => b.text === 'Open Webmail');
      const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);
      await ReactTestRenderer.act(async () => {
        await webmailButton.onPress();
      });
      expect(openURLSpy).toHaveBeenCalledWith(expect.stringContaining('mail.google.com/mail'));

      // Verify Copy Email & Message copies to clipboard
      const copyButton = buttons.find((b: any) => b.text === 'Copy Email & Message');
      const clipboardSpy = jest.spyOn(Clipboard, 'setString');
      await ReactTestRenderer.act(async () => {
        await copyButton.onPress();
      });
      expect(clipboardSpy).toHaveBeenCalledWith(expect.stringContaining('hello.tourbhook@gmail.com'));
    });

    it('prefers direct WhatsApp URL when available', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockImplementation(async (url: string) => {
        return url.startsWith('whatsapp://');
      });
      jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);

      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      const whatsappCard = root.findByProps({ testID: 'whatsapp-support-card' });
      await ReactTestRenderer.act(async () => {
        await whatsappCard.props.onPress();
      });

      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringMatching(/^whatsapp:\/\/send\?phone=919986474527&text=/)
      );
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('falls back to WhatsApp web click-to-chat URL when direct app is unavailable', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockImplementation(async (url: string) => {
        // whatsapp:// is not installed, but wa.me web URL is supported
        return url.startsWith('https://wa.me');
      });
      jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);

      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      const whatsappCard = root.findByProps({ testID: 'whatsapp-support-card' });
      await ReactTestRenderer.act(async () => {
        await whatsappCard.props.onPress();
      });

      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/wa\.me\/919986474527\?text=/)
      );
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('provides actionable fallback (Open in Browser & Copy Message) when WhatsApp cannot be opened', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false as never);
      jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('Cannot open WhatsApp') as never);

      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      const whatsappCard = root.findByProps({ testID: 'whatsapp-support-card' });
      await ReactTestRenderer.act(async () => {
        await whatsappCard.props.onPress();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Unable to Open WhatsApp',
        expect.stringContaining('+91 99864 74527'),
        expect.arrayContaining([
          expect.objectContaining({ text: 'Open in Browser' }),
          expect.objectContaining({ text: 'Copy Message' }),
          expect.objectContaining({ text: 'Cancel' }),
        ])
      );

      // Verify Open in Browser button
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const browserButton = buttons.find((b: any) => b.text === 'Open in Browser');
      const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);
      await ReactTestRenderer.act(async () => {
        await browserButton.onPress();
      });
      expect(openURLSpy).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/919986474527'));

      // Verify Copy Message button
      const copyButton = buttons.find((b: any) => b.text === 'Copy Message');
      const clipboardSpy = jest.spyOn(Clipboard, 'setString');
      await ReactTestRenderer.act(async () => {
        await copyButton.onPress();
      });
      expect(clipboardSpy).toHaveBeenCalledWith(expect.stringContaining('Heyy, I am Aarav Sharma.'));
    });

    it('navigates back when close button or back button is pressed', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<HelpSupportScreen />);
      });
      const root = renderer!.root;

      const closeBtn = root.findByProps({ accessibilityLabel: 'Close Help & Support' });
      ReactTestRenderer.act(() => {
        closeBtn.props.onPress();
      });

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('3. AndroidManifest package queries for Android 11+ visibility', () => {
    it('declares queries for mailto, whatsapp, and web schemes in AndroidManifest.xml', () => {
      const manifestPath = path.resolve(__dirname, '../../../../android/app/src/main/AndroidManifest.xml');
      const content = fs.readFileSync(manifestPath, 'utf8');

      expect(content).toContain('<queries>');
      expect(content).toContain('android:scheme="mailto"');
      expect(content).toContain('android:name="com.whatsapp"');
      expect(content).toContain('android:name="com.whatsapp.w4b"');
      expect(content).toContain('android:scheme="whatsapp"');
      expect(content).toContain('android:scheme="https"');
    });
  });
});

