import { useState, useEffect } from 'react';
import {
  GroupMember,
  GroupMessage,
  GroupVisibility,
  TravelGroup,
  getMockTravelGroups,
} from '../types/groupTypes';
import {
  MOCK_GROUP_MEMBERS,
  INITIAL_MOCK_MESSAGES,
  generateMockGroupResponse,
} from './mockGroupsData';

export interface CreateGroupInput {
  name: string;
  destination?: string;
  description?: string;
  category?: string;
  categories?: string[];
  travelDates?: string;
  maxMembers?: number;
  visibility?: GroupVisibility;
  requiresKyc?: boolean;
}

export interface UpdateGroupInput {
  name?: string;
  destination?: string;
  description?: string;
  category?: string;
  categories?: string[];
  travelDates?: string;
  maxMembers?: number;
  visibility?: GroupVisibility;
  requiresKyc?: boolean;
}

class GroupStore {
  private groups: TravelGroup[] = getMockTravelGroups();
  private joinedGroupIds: Set<string> = new Set();
  private messagesByGroup: Record<string, GroupMessage[]> = {};
  private notificationsByGroup: Record<string, boolean> = {};
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.groups = getMockTravelGroups();
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
    return [...this.groups];
  }

  getPublicGroups(): TravelGroup[] {
    return this.groups.filter(group => group.visibility !== 'private');
  }

  getDiscoverableGroups(): TravelGroup[] {
    return this.groups.filter(
      group =>
        group.visibility !== 'private' ||
        group.isOwnedByCurrentUser ||
        this.joinedGroupIds.has(group.id),
    );
  }

  getCreatedGroupCount(): number {
    return this.groups.filter(group => group.isOwnedByCurrentUser).length;
  }

  getJoinedGroupCount(): number {
    return this.groups.filter(
      group => this.joinedGroupIds.has(group.id) && !group.isOwnedByCurrentUser,
    ).length;
  }

  getGroupById(groupId: string): TravelGroup | undefined {
    return this.groups.find(g => g.id === groupId);
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

  createGroup(input: CreateGroupInput): TravelGroup {
    const trimmedName = input.name.trim();
    if (!trimmedName) {
      throw new Error('Group name is required');
    }

    const rawCategories: string[] =
      input.categories && input.categories.length > 0
        ? input.categories
        : input.category?.trim()
        ? [input.category.trim()]
        : ['Adventure'];

    if (rawCategories.length === 0) {
      throw new Error('At least one category is required');
    }

    const id = `group-${Date.now()}`;
    const primaryCategory = rawCategories[0].trim();
    const categories = rawCategories.map(c => c.trim().toLowerCase());
    const categoryLabel = primaryCategory.toUpperCase();

    const categoryTags = rawCategories.map(c => c.trim());
    const contextTag = input.destination?.trim() ? 'Trip' : 'Community';
    const tags = Array.from(new Set([...categoryTags, contextTag]));

    const newGroup: TravelGroup = {
      id,
      name: trimmedName,
      description:
        input.description?.trim() ||
        `Connect and explore ${input.destination?.trim() || 'new places'} with fellow travelers 🌍`,
      statusBadge: 'Active',
      statusType: 'active',
      categoryLabel,
      location: input.destination?.trim() || 'Global',
      travelDates: input.travelDates?.trim() || 'Flexible Dates',
      memberCount: 1, // Creator is member #1
      maxMembers: input.maxMembers || 8,
      memberAvatarEmojis: ['✈️'],
      memberInitials: ['Y'],
      tags,
      categories,
      notificationsEnabled: true,
      visibility: input.visibility || 'public',
      requiresKyc: input.requiresKyc || false,
      inviteUrl: `https://tourbhook.app/join/${id}`,
      isOwnedByCurrentUser: true,
    };

    this.groups = [newGroup, ...this.groups];
    // Creator automatically joins the new group
    this.joinedGroupIds.add(id);

    // Initialize messages for this group
    this.messagesByGroup[id] = [
      {
        id: `msg-welcome-${id}`,
        groupId: id,
        senderId: 'system',
        senderName: 'Tourbhook Community',
        senderAvatarEmoji: '🎉',
        senderInitials: 'TB',
        senderColor: '#0E7490',
        message: `Welcome to ${trimmedName}! Share itineraries, ask questions, and start planning together.`,
        timestamp: 'Just now',
        isCurrentUser: false,
        type: 'system',
      },
    ];

    this.notificationsByGroup[id] = true;
    this.notify();

    return newGroup;
  }

  updateGroup(groupId: string, input: UpdateGroupInput): TravelGroup {
    const index = this.groups.findIndex(g => g.id === groupId);
    if (index === -1) {
      throw new Error(`Group with id ${groupId} not found`);
    }

    const existing = this.groups[index];

    let name = existing.name;
    if (input.name !== undefined) {
      const trimmed = input.name.trim();
      if (!trimmed) {
        throw new Error('Group name is required');
      }
      name = trimmed;
    }

    let categories = existing.categories;
    let tags = existing.tags;
    let categoryLabel = existing.categoryLabel;

    const rawCategories: string[] | undefined =
      input.categories !== undefined
        ? input.categories
        : input.category !== undefined
        ? [input.category.trim()]
        : undefined;

    if (rawCategories !== undefined) {
      if (rawCategories.length === 0) {
        throw new Error('At least one category is required');
      }
      categories = rawCategories.map(c => c.trim().toLowerCase());
      const primaryCategory = rawCategories[0].trim();
      categoryLabel = primaryCategory.toUpperCase();

      const destination =
        input.destination !== undefined
          ? input.destination.trim()
          : existing.location;
      const contextTag = destination && destination !== 'Global' ? 'Trip' : 'Community';
      tags = Array.from(new Set([...rawCategories.map(c => c.trim()), contextTag]));
    }

    const updatedGroup: TravelGroup = {
      ...existing,
      name,
      description:
        input.description !== undefined
          ? input.description.trim() || undefined
          : existing.description,
      location:
        input.destination !== undefined
          ? input.destination.trim() || 'Global'
          : existing.location,
      travelDates:
        input.travelDates !== undefined
          ? input.travelDates.trim() || 'Flexible Dates'
          : existing.travelDates,
      maxMembers:
        input.maxMembers !== undefined ? input.maxMembers : existing.maxMembers,
      categories,
      tags,
      categoryLabel,
      visibility: input.visibility ?? existing.visibility ?? 'public',
      requiresKyc: input.requiresKyc ?? existing.requiresKyc ?? false,
    };

    this.groups[index] = updatedGroup;
    this.notify();

    return updatedGroup;
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
    createdGroupCount: groupStore.getCreatedGroupCount(),
    joinedGroupCount: groupStore.getJoinedGroupCount(),
    joinGroup: (id: string) => groupStore.joinGroup(id),
    leaveGroup: (id: string) => groupStore.leaveGroup(id),
    createGroup: (input: CreateGroupInput) => groupStore.createGroup(input),
    updateGroup: (id: string, input: UpdateGroupInput) => groupStore.updateGroup(id, input),
    sendMessage: (id: string, text: string) => {
      groupStore.sendUserMessage(id, text);
      groupStore.triggerMockAutoResponse(id, text);
    },
    toggleNotifications: (id: string) => groupStore.toggleNotifications(id),
  };
}
