import { GroupMember, GroupMessage, TravelGroup } from '../types/groupTypes';
import { groupStore } from '../data/groupStore';

/**
 * Service contract for Tourbhook Group Chat.
 * Currently bridges to the reactive local mock layer.
 * A future real-time backend/WebSocket API can replace this service
 * without requiring any changes to the UI components.
 */
export const groupChatService = {
  /**
   * Retrieves group metadata by ID.
   */
  async getGroupDetails(groupId: string): Promise<TravelGroup | undefined> {
    return groupStore.getGroupById(groupId);
  },

  /**
   * Retrieves all chat messages for a group.
   */
  async getMessages(groupId: string): Promise<GroupMessage[]> {
    return groupStore.getGroupMessages(groupId);
  },

  /**
   * Retrieves all members of a group.
   */
  async getMembers(groupId: string): Promise<GroupMember[]> {
    return groupStore.getGroupMembers(groupId);
  },

  /**
   * Sends a user message to the group.
   */
  async sendMessage(groupId: string, text: string): Promise<GroupMessage> {
    const message = groupStore.sendUserMessage(groupId, text);
    groupStore.triggerMockAutoResponse(groupId, text);
    return message;
  },

  /**
   * Joins a travel group.
   */
  async joinGroup(groupId: string): Promise<boolean> {
    groupStore.joinGroup(groupId);
    return true;
  },

  /**
   * Leaves a travel group.
   */
  async leaveGroup(groupId: string): Promise<boolean> {
    groupStore.leaveGroup(groupId);
    return true;
  },

  /**
   * Toggles notification settings for a group.
   */
  async toggleNotifications(groupId: string): Promise<boolean> {
    return groupStore.toggleNotifications(groupId);
  },
};
