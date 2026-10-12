import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Send,
  Plus,
  Info,
  Smile,
  CheckCheck,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import { useGroupState } from '../data/groupStore';
import { GroupMessage } from '../types/groupTypes';

export default function GroupChatScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, 'GroupChat'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'GroupChat'>>();
  const groupId = route.params?.groupId || 'group-paris';

  const { group, messages, sendMessage, isJoined } = useGroupState(groupId);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<GroupMessage>>(null);

  useEffect(() => {
    // Direct navigation must not bypass KYC or plan-limit checks on Group Details.
    if (!isJoined) {
      navigation.replace('GroupDetails', { groupId });
    }
  }, [isJoined, groupId, navigation]);

  useEffect(() => {
    // Auto scroll to bottom when messages update
    if (!isJoined) {
      return;
    }
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [isJoined, messages.length]);

  if (!isJoined) {
    return <SafeAreaView style={styles.safeArea} testID="group-chat-access-guard" />;
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    sendMessage(groupId, textToSend);
  };

  const renderMessageItem = ({ item, index }: { item: GroupMessage; index: number }) => {
    const isMe = item.isCurrentUser;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const isSameSender = prevMessage && prevMessage.senderId === item.senderId;

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowRight : styles.messageRowLeft,
          isSameSender ? styles.messageRowGrouped : null,
        ]}
      >
        {/* Left Avatar for incoming messages (only if first in consecutive sequence) */}
        {!isMe && (
          <View style={styles.avatarContainer}>
            {!isSameSender ? (
              <View
                style={[
                  styles.senderAvatar,
                  { backgroundColor: item.senderColor ? `${item.senderColor}20` : '#E0F2FE' },
                ]}
              >
                <Text
                  style={[
                    styles.senderAvatarText,
                    { color: item.senderColor || AppColors.primary },
                  ]}
                >
                  {item.senderInitials || item.senderName.charAt(0)}
                </Text>
              </View>
            ) : (
              <View style={styles.avatarSpacer} />
            )}
          </View>
        )}

        {/* Message Bubble */}
        <View
          style={[
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
          ]}
        >
          {/* Sender Name for other members */}
          {!isMe && !isSameSender && (
            <Text
              style={[
                styles.senderNameText,
                { color: item.senderColor || AppColors.primary },
              ]}
            >
              {item.senderName}
            </Text>
          )}

          {/* Message Text Content */}
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.message}
          </Text>

          {/* Timestamp & Read Receipts */}
          <View style={styles.timestampRow}>
            <Text style={[styles.timestampText, isMe ? styles.timestampTextMe : styles.timestampTextOther]}>
              {item.timestamp}
            </Text>
            {isMe && (
              <CheckCheck size={14} color="#0E7490" strokeWidth={2} style={styles.checkIcon} />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />

        <TouchableOpacity
          style={styles.headerInfoArea}
          onPress={() => navigation.navigate('GroupInfo', { groupId })}
          activeOpacity={0.7}
        >
          <View style={styles.groupAvatarCircle}>
            <Text style={styles.groupAvatarEmoji}>
              {group?.memberAvatarEmojis?.[3] || '🇫🇷'}
            </Text>
          </View>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerGroupTitle} numberOfLines={1}>
              {group?.name || 'Paris Explorers 🇫🇷'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {group?.memberCount || 128} members • Active now
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoBtn}
          onPress={() => navigation.navigate('GroupInfo', { groupId })}
          activeOpacity={0.7}
        >
          <Info size={22} color={AppColors.primary} />
        </TouchableOpacity>
      </View>

      {/* Chat Area with Keyboard Avoiding */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Date Divider */}
        <View style={styles.dateDivider}>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>Today</Text>
          </View>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
            <Plus size={20} color={AppColors.textMuted} />
          </TouchableOpacity>

          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={AppColors.textLight}
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              maxLength={500}
            />
            <TouchableOpacity style={styles.emojiBtn} activeOpacity={0.7}>
              <Smile size={18} color={AppColors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() ? styles.sendBtnDisabled : styles.sendBtnActive,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Send
              size={17}
              color={inputText.trim() ? AppColors.white : AppColors.textLight}
              strokeWidth={2.2}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerInfoArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  groupAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  groupAvatarEmoji: {
    fontSize: 18,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '500',
    marginTop: 1,
  },
  infoBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: 12,
  },
  datePill: {
    backgroundColor: '#EAE5DC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageRowGrouped: {
    marginBottom: 4,
  },
  avatarContainer: {
    width: 32,
    marginRight: 6,
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderAvatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  avatarSpacer: {
    width: 32,
    height: 1,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleMe: {
    backgroundColor: '#E0F2FE',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  bubbleOther: {
    backgroundColor: AppColors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  senderNameText: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextMe: {
    color: AppColors.textPrimary,
  },
  messageTextOther: {
    color: AppColors.textPrimary,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timestampText: {
    fontSize: 10,
  },
  timestampTextMe: {
    color: AppColors.primaryDark,
  },
  timestampTextOther: {
    color: AppColors.textLight,
  },
  checkIcon: {
    marginLeft: 2,
  },

  /* Input Bar */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: AppColors.surface,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    gap: 8,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textPrimary,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  emojiBtn: {
    padding: 4,
    marginLeft: 4,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: AppColors.primary,
  },
  sendBtnDisabled: {
    backgroundColor: '#EAE5DC',
  },
});
