import { useState, useEffect } from 'react';
import { GroupMember, GroupMessage, TravelGroup, getMockTravelGroups } from '../types/groupTypes';
import {
  MOCK_GROUP_MEMBERS,
  INITIAL_MOCK_MESSAGES,
  generateMockGroupResponse,
} from './mockGroupsData';

class GroupStore {
  private joinedGroupIds: Set<string> = new Set();
  private messagesByGroup: Record<string, GroupMessage[]> = {};
  private notificationsByGroup: Record<string, boolean> = {};
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.joinedGroupIds = new Set();
    this.messagesByGroup = {
      'group-paris': [...(INITIAL_MOCK_MESSAGES['group-paris'] || [])],
      'group-1': [...(INITIAL_MOCK_MESSAGES.default || [])],
      'group-2': [...(INITIAL_MOCK_MESSAGES.default || [])],
      'group-3': [...(INITIAL_MOCK_MESSAGES.default || [])],
    };
    this.notificationsByGroup = {
      'group-paris': true,
      'group-1': true,
      'group-2': true,
      'group-3': true,
    };
    this.notify();
  }

  getGroups(): TravelGroup[] {
    return getMockTravelGroups();
  }

  getGroupById(groupId: string): TravelGroup | undefined {
    return this.getGroups().find(g => g.id === groupId);
  }

  isGroupJoined(groupId: string): boolean {
    return this.joinedGroupIds.has(groupId);
  }

  joinGroup(groupId: string): void {
    this.joinedGroupIds.add(groupId);
    this.notify();
  }

  leaveGroup(groupId: string): void {
    this.joinedGroupIds.delete(groupId);
    this.notify();
  }

  getGroupMessages(groupId: string): GroupMessage[] {
    if (!this.messagesByGroup[groupId]) {
      this.messagesByGroup[groupId] = [...(INITIAL_MOCK_MESSAGES.default || [])];
    }
    return this.messagesByGroup[groupId];
  }

  getGroupMembers(groupId: string): GroupMember[] {
    return MOCK_GROUP_MEMBERS[groupId] || MOCK_GROUP_MEMBERS.default;
  }

  isNotificationsEnabled(groupId: string): boolean {
    return this.notificationsByGroup[groupId] ?? true;
  }

  toggleNotifications(groupId: string): boolean {
    const current = this.isNotificationsEnabled(groupId);
    this.notificationsByGroup[groupId] = !current;
    this.notify();
    return !current;
  }

  /**
   * Appends a message from the current user immediately.
   */
  sendUserMessage(groupId: string, text: string): GroupMessage {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timestamp = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const newMessage: GroupMessage = {
      id: `msg-user-${Date.now()}`,
      groupId,
      senderId: 'member-current',
      senderName: 'You',
      senderInitials: 'J',
      message: text.trim(),
      timestamp,
      isCurrentUser: true,
      type: 'text',
    };

    if (!this.messagesByGroup[groupId]) {
      this.messagesByGroup[groupId] = [];
    }

    this.messagesByGroup[groupId] = [...this.messagesByGroup[groupId], newMessage];
    this.notify();

    return newMessage;
  }

  /**
   * Simulates an auto-response from a mock member after a short delay.
   */
  triggerMockAutoResponse(groupId: string, userText: string): void {
    const group = this.getGroupById(groupId);
    const groupName = group?.name || 'Paris Explorers';
    const mockBot = generateMockGroupResponse(userText, groupName);

    setTimeout(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timestamp = `${formattedHours}:${formattedMinutes} ${ampm}`;

      const botMessage: GroupMessage = {
        id: `msg-bot-${Date.now()}`,
        groupId,
        senderId: `bot-${mockBot.senderName}`,
        senderName: mockBot.senderName,
        senderAvatarEmoji: mockBot.senderAvatarEmoji,
        senderInitials: mockBot.senderInitials,
        senderColor: mockBot.senderColor,
        message: mockBot.text,
        timestamp,
        isCurrentUser: false,
        type: 'text',
      };

      if (!this.messagesByGroup[groupId]) {
        this.messagesByGroup[groupId] = [];
      }

      this.messagesByGroup[groupId] = [...this.messagesByGroup[groupId], botMessage];
      this.notify();
    }, 900);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => {
      try {
        l();
      } catch {
        // Ignored
      }
    });
  }
}

export const groupStore = new GroupStore();

export function useGroupState(groupId?: string) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = groupStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const group = groupId ? groupStore.getGroupById(groupId) : undefined;
  const isJoined = groupId ? groupStore.isGroupJoined(groupId) : false;
  const messages = groupId ? groupStore.getGroupMessages(groupId) : [];
  const members = groupId ? groupStore.getGroupMembers(groupId) : [];
  const notificationsEnabled = groupId ? groupStore.isNotificationsEnabled(groupId) : true;

  return {
    group,
    isJoined,
    messages,
    members,
    notificationsEnabled,
    joinGroup: (id: string) => groupStore.joinGroup(id),
    leaveGroup: (id: string) => groupStore.leaveGroup(id),
    sendMessage: (id: string, text: string) => {
      groupStore.sendUserMessage(id, text);
      groupStore.triggerMockAutoResponse(id, text);
    },
    toggleNotifications: (id: string) => groupStore.toggleNotifications(id),
  };
}
