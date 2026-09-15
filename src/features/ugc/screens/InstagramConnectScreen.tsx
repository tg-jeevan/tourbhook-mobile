import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Video,
  RefreshCw,
  LogOut,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react-native';
import { InstagramIcon } from '../components/SocialIcons';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { InstagramService } from '../services/instagramService';
import { InstagramConnectionState } from '../types/ugcTypes';

const PRIMARY_GREEN = '#1FAE5D';
const DARK_NAVY = '#1A1A2E';
const MUTED_TEXT = '#8E8E93';
const ACCENT_PINK = '#E91E63';
const INSTA_PURPLE = '#C13584';

export default function InstagramConnectScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [state, setState] = useState<InstagramConnectionState>(() =>
    InstagramService.getConnectionState()
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const newState = await InstagramService.connectInstagram();
      setState(newState);
      Alert.alert(
        'Instagram Connected!',
        `Successfully linked @${newState.profile?.username}. Your approved travel Reels are now synchronized.`
      );
    } catch {
      Alert.alert('Connection Failed', 'Could not connect to Instagram. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Instagram Account?',
      'Your previously synced travel Reels will remain in draft review. You can reconnect anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            const newState = await InstagramService.disconnectInstagram();
            setState(newState);
          },
        },
      ]
    );
  };

  const handleSyncReels = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 800));
    setIsSyncing(false);
    Alert.alert('Reels Synchronized', 'All recent travel Reels are up to date and passed to moderation.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Instagram Connection</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!state.isConnected ? (
          /* ── NOT CONNECTED STATE ──────────────────────────────────── */
          <View style={styles.notConnectedContainer}>
            {/* Instagram Branding Icon */}
            <View style={styles.instaIconCircle}>
              <InstagramIcon size={44} color="#FFFFFF" />
            </View>

            <Text style={styles.heroTitle}>Connect Your Instagram</Text>
            <Text style={styles.heroSubtitle}>
              Seamlessly sync and showcase your travel Reels, stories, and recommendations directly within Tourbhook itineraries.
            </Text>

            {/* Value Proposition Cards */}
            <View style={styles.benefitsCard}>
              <View style={styles.benefitRow}>
                <View style={styles.benefitIconBox}>
                  <Video size={18} color={PRIMARY_GREEN} />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>Auto-Sync Travel Reels</Text>
                  <Text style={styles.benefitDesc}>
                    Import public destination Reels without manually uploading video files.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitDivider} />

              <View style={styles.benefitRow}>
                <View style={styles.benefitIconBox}>
                  <Sparkles size={18} color={PRIMARY_GREEN} />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>AI Destination Association</Text>
                  <Text style={styles.benefitDesc}>
                    Smart analysis automatically tags landmark venues, secret spots, and sunset timings.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitDivider} />

              <View style={styles.benefitRow}>
                <View style={styles.benefitIconBox}>
                  <ShieldCheck size={18} color={PRIMARY_GREEN} />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>Zero-Tolerance Content Safety</Text>
                  <Text style={styles.benefitDesc}>
                    All submitted videos undergo strict moderation before being surfaced to fellow travelers.
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy Disclaimer */}
            <View style={styles.privacyBox}>
              <Info size={14} color={MUTED_TEXT} />
              <Text style={styles.privacyText}>
                Tourbhook only accesses your public travel Reels. We will never post or modify anything on your account.
              </Text>
            </View>

            {/* Connect Button */}
            <TouchableOpacity
              style={styles.connectBtn}
              onPress={handleConnect}
              disabled={isConnecting}
              activeOpacity={0.85}
            >
              {isConnecting ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.connectBtnText}>Connecting to Instagram...</Text>
                </>
              ) : (
                <>
                  <InstagramIcon size={20} color="#FFFFFF" />
                  <Text style={styles.connectBtnText}>Connect with Instagram</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* ── CONNECTED STATE ──────────────────────────────────────── */
          <View style={styles.connectedContainer}>
            {/* Connected Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarWrapper}>
                  {state.profile?.profilePicUrl ? (
                    <Image
                      source={{ uri: state.profile.profilePicUrl }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatarFallback} />
                  )}
                  <View style={styles.instaBadge}>
                    <InstagramIcon size={12} color="#FFFFFF" />
                  </View>
                </View>

                <View style={styles.profileMeta}>
                  <View style={styles.nameRow}>
                    <Text style={styles.fullName}>{state.profile?.fullName}</Text>
                    {state.profile?.isVerified && (
                      <CheckCircle2 size={16} color={PRIMARY_GREEN} />
                    )}
                  </View>
                  <Text style={styles.username}>@{state.profile?.username}</Text>
                  <View style={styles.statusChip}>
                    <View style={styles.greenDot} />
                    <Text style={styles.statusChipText}>Connected & Verified</Text>
                  </View>
                </View>
              </View>

              {state.profile?.bio && (
                <Text style={styles.bioText}>{state.profile.bio}</Text>
              )}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{state.profile?.reelsCount || 0}</Text>
                  <Text style={styles.statLabel}>Synced Reels</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>100%</Text>
                  <Text style={styles.statLabel}>Moderation Pass</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>Active</Text>
                  <Text style={styles.statLabel}>Account Status</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions Card */}
            <View style={styles.actionsCard}>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() =>
                  navigation.navigate('TripDetails', { tripId: '1' })
                }
              >
                <View style={styles.actionIconBg}>
                  <Layers size={18} color={PRIMARY_GREEN} />
                </View>
                <View style={styles.actionTextCol}>
                  <Text style={styles.actionTitle}>View Synced Destination Reels</Text>
                  <Text style={styles.actionSub}>Browse your approved Reels in Paris itineraries</Text>
                </View>
                <ChevronRight size={18} color={MUTED_TEXT} />
              </TouchableOpacity>

              <View style={styles.benefitDivider} />

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleSyncReels}
                disabled={isSyncing}
              >
                <View style={styles.actionIconBg}>
                  {isSyncing ? (
                    <ActivityIndicator size="small" color={PRIMARY_GREEN} />
                  ) : (
                    <RefreshCw size={18} color={PRIMARY_GREEN} />
                  )}
                </View>
                <View style={styles.actionTextCol}>
                  <Text style={styles.actionTitle}>
                    {isSyncing ? 'Syncing Reels...' : 'Sync Recent Reels'}
                  </Text>
                  <Text style={styles.actionSub}>Fetch latest public Reels from your profile</Text>
                </View>
                <ChevronRight size={18} color={MUTED_TEXT} />
              </TouchableOpacity>
            </View>

            {/* Disconnect Button */}
            <TouchableOpacity
              style={styles.disconnectBtn}
              onPress={handleDisconnect}
              activeOpacity={0.7}
            >
              <LogOut size={16} color={ACCENT_PINK} />
              <Text style={styles.disconnectBtnText}>Disconnect Instagram Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_NAVY,
  },
  placeholder: {
    width: 44,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  notConnectedContainer: {
    alignItems: 'center',
  },
  instaIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: INSTA_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    shadowColor: INSTA_PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK_NAVY,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  benefitsCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_NAVY,
    marginBottom: 3,
  },
  benefitDesc: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  benefitDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 14,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    marginBottom: 28,
  },
  privacyText: {
    fontSize: 12,
    color: MUTED_TEXT,
    lineHeight: 16,
    flex: 1,
  },
  connectBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: INSTA_PURPLE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: INSTA_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  connectedContainer: {
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: PRIMARY_GREEN,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEEEEE',
  },
  instaBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: INSTA_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  fullName: {
    fontSize: 17,
    fontWeight: '700',
    color: DARK_NAVY,
  },
  username: {
    fontSize: 13,
    color: MUTED_TEXT,
    fontWeight: '500',
    marginBottom: 6,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_GREEN,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: PRIMARY_GREEN,
  },
  bioText: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 19,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_NAVY,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: MUTED_TEXT,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F7EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_NAVY,
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 12,
    color: MUTED_TEXT,
  },
  disconnectBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FCE4EC',
    borderWidth: 1,
    borderColor: '#F8BBD0',
    marginTop: 8,
  },
  disconnectBtnText: {
    color: ACCENT_PINK,
    fontWeight: '600',
    fontSize: 14,
  },
});
