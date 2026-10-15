import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Mail,
  MessageCircle,
  ChevronRight,
  X,
  Clock,
  Send,
} from 'lucide-react-native';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import { useAuth } from '../../../core/auth/AuthContext';

export const SUPPORT_EMAIL = 'hello.tourbhook@gmail.com';
export const SUPPORT_PHONE_RAW = '919986474527';
export const SUPPORT_PHONE_DISPLAY = '+91 99864 74527';
export const SUPPORT_EMAIL_SUBJECT = 'Tourbhook App Support';

export function getEmailBody(userName?: string): string {
  const name = userName?.trim() || '[Your Name]';
  return `Heyy, I am ${name}. I need your assistance with the Tourbhook Application.\n\nIssue/Query:\n[Please describe how we can help you.]\n\nThank you.`;
}

export function getWhatsAppMessage(userName?: string): string {
  const name = userName?.trim() || '[Your Name]';
  return `Heyy, I am ${name}. I need your assistance with the Tourbhook Application.`;
}

export function getEmailUrl(userName?: string): string {
  const subject = SUPPORT_EMAIL_SUBJECT;
  const body = getEmailBody(userName);
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getWebmailUrl(userName?: string): string {
  const subject = SUPPORT_EMAIL_SUBJECT;
  const body = getEmailBody(userName);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getWhatsAppUrls(userName?: string): { directUrl: string; webUrl: string } {
  const message = getWhatsAppMessage(userName);
  const encoded = encodeURIComponent(message);
  return {
    directUrl: `whatsapp://send?phone=${SUPPORT_PHONE_RAW}&text=${encoded}`,
    webUrl: `https://wa.me/${SUPPORT_PHONE_RAW}?text=${encoded}`,
  };
}

export function copyToClipboard(text: string): boolean {
  try {
    if (Clipboard && typeof Clipboard.setString === 'function') {
      Clipboard.setString(text);
      return true;
    }
  } catch (e) {
    console.warn('Failed to copy to clipboard', e);
  }
  return false;
}

export default function HelpSupportScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleEmailSupport = async () => {
    const emailUrl = getEmailUrl(user?.name);
    const webmailUrl = getWebmailUrl(user?.name);
    const body = getEmailBody(user?.name);

    // 1. Try checking if mailto can be opened
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
        return;
      }
    } catch {
      // Continue to direct open attempt
    }

    // 2. Try direct open in case canOpenURL returned a false negative
    try {
      await Linking.openURL(emailUrl);
      return;
    } catch {
      // Direct open failed
    }

    // 3. Fallback when email app is unavailable: provide actionable copy & webmail options
    Alert.alert(
      'Unable to Open Email',
      `No compatible email application was found. You can open webmail or copy the support details to compose manually.`,
      [
        {
          text: 'Open Webmail',
          onPress: async () => {
            try {
              await Linking.openURL(webmailUrl);
            } catch {
              copyToClipboard(SUPPORT_EMAIL);
              Alert.alert('Support Email', `Please write directly to ${SUPPORT_EMAIL}.`);
            }
          },
        },
        {
          text: 'Copy Email & Message',
          onPress: () => {
            const details = `To: ${SUPPORT_EMAIL}\nSubject: ${SUPPORT_EMAIL_SUBJECT}\n\n${body}`;
            copyToClipboard(details);
            Alert.alert('Copied to Clipboard', 'Support email details copied to clipboard.');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleWhatsAppSupport = async () => {
    const { directUrl, webUrl } = getWhatsAppUrls(user?.name);
    const message = getWhatsAppMessage(user?.name);

    // 1. Prefer installed WhatsApp application (whatsapp://)
    try {
      const canOpenDirect = await Linking.canOpenURL(directUrl);
      if (canOpenDirect) {
        try {
          await Linking.openURL(directUrl);
          return;
        } catch {
          // If direct open throws, proceed to web fallback
        }
      }
    } catch {
      // Continue
    }

    // 2. Allow WhatsApp Business or official web fallback (wa.me)
    try {
      const canOpenWeb = await Linking.canOpenURL(webUrl);
      if (canOpenWeb) {
        try {
          await Linking.openURL(webUrl);
          return;
        } catch {
          // If web open throws, proceed to direct attempts
        }
      }
    } catch {
      // Continue
    }

    // 3. Try direct openURL attempts in case canOpenURL had false negative
    try {
      await Linking.openURL(directUrl);
      return;
    } catch {
      // Continue
    }

    try {
      await Linking.openURL(webUrl);
      return;
    } catch {
      // Web open failed
    }

    // 4. WhatsApp cannot be opened: provide working Open in Browser or Copy Message fallback
    Alert.alert(
      'Unable to Open WhatsApp',
      `WhatsApp could not be opened. Please message our team at ${SUPPORT_PHONE_DISPLAY} or choose an option below.`,
      [
        {
          text: 'Open in Browser',
          onPress: async () => {
            try {
              await Linking.openURL(webUrl);
            } catch {
              copyToClipboard(message);
              Alert.alert('Support WhatsApp', `Please message our team at ${SUPPORT_PHONE_DISPLAY}.`);
            }
          },
        },
        {
          text: 'Copy Message',
          onPress: () => {
            copyToClipboard(message);
            Alert.alert('Copied to Clipboard', 'Message copied to clipboard.');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close Help & Support"
        >
          <X size={20} color={AppColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Hero Info Banner ───────────────────────────────────────────── */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>Need a hand?</Text>
          <Text style={styles.bannerSubtitle}>Our support team is ready to help.</Text>
          <Text style={styles.bannerNote}>We typically respond within 5 minutes.</Text>
          <View style={styles.hoursRow}>
            <Clock size={13} color="#FF6B4A" style={styles.hoursIcon} />
            <Text style={styles.bannerHours}>
              Support working hours: Mon – Sat: 11 AM to 7 PM
            </Text>
          </View>
        </View>

        {/* ── Option A: Email Support ───────────────────────────────────── */}
        <TouchableOpacity
          style={styles.card}
          onPress={handleEmailSupport}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Email Support. Send our team a message."
          testID="email-support-card"
        >
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Mail size={22} color="#0E7490" strokeWidth={2.2} />
            </View>
            <View style={styles.cardTitleCol}>
              <Text style={styles.cardTitle}>Email Support</Text>
            </View>
            <ChevronRight size={20} color={AppColors.textMuted} />
          </View>

          <Text style={styles.cardDescription}>
            Need help with Tourbhook? Send our team a message.
          </Text>

          <View style={styles.actionBtnRow}>
            <View style={styles.primaryActionButton}>
              <Send size={14} color={AppColors.white} />
              <Text style={styles.primaryActionText}>Send Email</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Option B: Live Chat (WhatsApp) ────────────────────────────── */}
        <TouchableOpacity
          style={styles.card}
          onPress={handleWhatsAppSupport}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Live Chat: Chat with us on WhatsApp Business."
          testID="whatsapp-support-card"
        >
          <View style={[styles.cardHeaderRow, styles.chatCardHeaderRow]}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <MessageCircle size={22} color="#16A34A" strokeWidth={2.2} />
            </View>
            <View style={styles.cardTitleCol}>
              <Text style={styles.cardTitle}>Live Chat</Text>
              <Text style={styles.cardSubtitle}>Chat with us on WhatsApp Business</Text>
            </View>
            <ChevronRight size={20} color={AppColors.textMuted} />
          </View>

          <View style={styles.actionBtnRow}>
            <View style={[styles.primaryActionButton, { backgroundColor: '#16A34A' }]}>
              <MessageCircle size={14} color={AppColors.white} />
              <Text style={styles.primaryActionText}>Chat on WhatsApp</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  closeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  /* ── Banner ── */
  bannerContainer: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: AppColors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  bannerNote: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
    lineHeight: 18,
    marginBottom: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  hoursIcon: {
    marginRight: 2,
  },
  bannerHours: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B4A',
  },
  /* ── Support Cards ── */
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTitleCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginTop: 2,
  },
  chatCardHeaderRow: {
    marginBottom: 16,
  },
  cardDescription: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.white,
  },
});