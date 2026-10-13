import { getGroupAccessGateCopy } from './GroupAccessGateModal';

describe('GroupAccessGateModal copy', () => {
  it('does not promise a KYC route that the frontend does not provide', () => {
    const copy = getGroupAccessGateCopy('kyc_required', 'free');

    expect(copy.confirmText).toBe('Okay');
    expect(copy.message).toContain('Complete KYC from your account');
  });

  it('offers an upgrade only when a higher plan is available', () => {
    expect(getGroupAccessGateCopy('join_limit_reached', 'free').confirmText).toBe(
      'View plans',
    );
    expect(
      getGroupAccessGateCopy('join_limit_reached', 'premium').confirmText,
    ).toBe('Okay');
    expect(
      getGroupAccessGateCopy('join_limit_reached', 'premium').message,
    ).not.toContain('Upgrade');
  });
});
