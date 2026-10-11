import { groupStore } from './groupStore';
import { generateMockGroupResponse } from './mockGroupsData';
import { groupChatService } from '../services/groupChatService';

describe('GroupStore & Mock Chat Experience', () => {
  beforeEach(() => {
    groupStore.reset();
  });

  describe('membership state', () => {
    it('starts with groups unjoined by default', () => {
      expect(groupStore.isGroupJoined('group-paris')).toBe(false);
    });

    it('joins and leaves groups correctly', () => {
      groupStore.joinGroup('group-paris');
      expect(groupStore.isGroupJoined('group-paris')).toBe(true);

      groupStore.leaveGroup('group-paris');
      expect(groupStore.isGroupJoined('group-paris')).toBe(false);
    });

    it('notifies subscribers on membership change', () => {
      const listener = jest.fn();
      const unsubscribe = groupStore.subscribe(listener);

      groupStore.joinGroup('group-paris');
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      groupStore.leaveGroup('group-paris');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('chat messages', () => {
    it('provides initial mock conversation for Paris Explorers', () => {
      const messages = groupStore.getGroupMessages('group-paris');
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].senderName).toBe('Aarav');
    });

    it('appends user message and triggers update', () => {
      const initialCount = groupStore.getGroupMessages('group-paris').length;
      const sent = groupStore.sendUserMessage('group-paris', 'Hello from test');

      expect(sent.message).toBe('Hello from test');
      expect(sent.isCurrentUser).toBe(true);

      const updated = groupStore.getGroupMessages('group-paris');
      expect(updated.length).toBe(initialCount + 1);
      expect(updated[updated.length - 1].message).toBe('Hello from test');
    });

    it('generates contextual mock auto-responses', () => {
      const hiResponse = generateMockGroupResponse('hi everyone', 'Paris Explorers');
      expect(hiResponse.senderName).toBe('Maya');
      expect(hiResponse.text).toContain('Welcome');

      const eiffelResponse = generateMockGroupResponse('Anyone visiting the Eiffel tower?', 'Paris Explorers');
      expect(eiffelResponse.senderName).toBe('Rahul');
      expect(eiffelResponse.text).toContain('sunset');

      const foodResponse = generateMockGroupResponse('Best food and cafe spots?', 'Paris Explorers');
      expect(foodResponse.senderName).toBe('Sophie');
      expect(foodResponse.text).toContain('pastries');
    });
  });

  describe('notifications', () => {
    it('toggles group notifications', () => {
      expect(groupStore.isNotificationsEnabled('group-paris')).toBe(true);
      const muted = groupStore.toggleNotifications('group-paris');
      expect(muted).toBe(false);
      expect(groupStore.isNotificationsEnabled('group-paris')).toBe(false);
    });
  });

  describe('groupChatService boundary', () => {
    it('provides service methods bridging to store', async () => {
      const group = await groupChatService.getGroupDetails('group-paris');
      expect(group?.name).toContain('Paris Explorers');

      const members = await groupChatService.getMembers('group-paris');
      expect(members.length).toBeGreaterThanOrEqual(4);

      await groupChatService.joinGroup('group-paris');
      expect(groupStore.isGroupJoined('group-paris')).toBe(true);

      await groupChatService.leaveGroup('group-paris');
      expect(groupStore.isGroupJoined('group-paris')).toBe(false);
    });
  });
});
