import React from 'react';
import { TextInput } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import GroupChatScreen from './GroupChatScreen';

const mockReplace = jest.fn();
const mockUseGroupState = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: jest.fn() }),
  useRoute: () => ({ params: { groupId: 'private-group' } }),
}));

jest.mock('react-native-safe-area-context', () => {
  const ReactActual = jest.requireActual('react');
  return {
    SafeAreaView: ({ children, ...props }: any) =>
      ReactActual.createElement('SafeAreaView', props, children),
  };
});

jest.mock('../data/groupStore', () => ({
  useGroupState: (...args: unknown[]) => mockUseGroupState(...args),
}));

describe('GroupChatScreen access guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGroupState.mockReturnValue({
      group: { id: 'private-group', name: 'Private Group' },
      messages: [{ id: 'secret-message', text: 'Protected content' }],
      sendMessage: jest.fn(),
      isJoined: false,
    });
  });

  it('renders no chat content while redirecting a non-member', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      renderer = ReactTestRenderer.create(<GroupChatScreen />);
    });

    expect(mockReplace).toHaveBeenCalledWith('GroupDetails', {
      groupId: 'private-group',
    });
    expect(
      renderer!.root.findByProps({ testID: 'group-chat-access-guard' }),
    ).toBeDefined();
    expect(renderer!.root.findAllByType(TextInput)).toHaveLength(0);
  });
});
