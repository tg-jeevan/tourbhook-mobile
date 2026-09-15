import { instagramService } from './instagramService';
import { UGCItem } from '../types/ugcTypes';

describe('instagramService', () => {
  beforeEach(async () => {
    // Reset to not connected before each test
    await instagramService.disconnectInstagram();
  });

  it('starts in not connected state (isConnected: false, profile: null)', () => {
    const status = instagramService.getConnectionState();
    expect(status.isConnected).toBe(false);
    expect(status.profile).toBeNull();
  });

  it('successfully connects and returns connected profile in mock adapter mode', async () => {
    const result = await instagramService.connectInstagram();
    expect(result.isConnected).toBe(true);
    expect(result.profile).not.toBeNull();
    expect(result.profile?.username).toBe('wanderlust_mani');
    expect(result.profile?.reelsCount).toBeGreaterThan(0);
    expect(result.profile?.isVerified).toBe(true);

    const currentStatus = instagramService.getConnectionState();
    expect(currentStatus.isConnected).toBe(true);
    expect(currentStatus.profile?.username).toBe('wanderlust_mani');
  });

  it('successfully disconnects and resets connection state', async () => {
    await instagramService.connectInstagram();
    const disconnectResult = await instagramService.disconnectInstagram();
    expect(disconnectResult.isConnected).toBe(false);
    expect(disconnectResult.profile).toBeNull();

    const currentStatus = instagramService.getConnectionState();
    expect(currentStatus.isConnected).toBe(false);
  });

  it('allows fetching user synced reels after connection', async () => {
    await instagramService.connectInstagram();
    const reels: UGCItem[] = await instagramService.fetchUserSyncedReels();
    expect(reels.length).toBeGreaterThan(0);
    reels.forEach((reel: UGCItem) => {
      expect(reel.status).toBe('approved');
      expect(reel.platform).toBe('instagram');
    });
  });

  it('returns empty array if fetching synced reels while not connected', async () => {
    const reels = await instagramService.fetchUserSyncedReels();
    expect(reels).toEqual([]);
  });
});
