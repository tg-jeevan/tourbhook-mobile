import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { CheckCircle2, AlertCircle, X } from 'lucide-react-native';
import { AppColors } from '../theme/colors';

export interface FeedbackToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
  duration?: number;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  visible,
  message,
  type = 'success',
  onDismiss,
  duration = 3000,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();

      timer = setTimeout(() => {
        handleDismiss();
      }, duration);
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        isSuccess && styles.successToast,
        isError && styles.errorToast,
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.contentRow}>
        {isSuccess && <CheckCircle2 size={18} color="#059669" />}
        {isError && <AlertCircle size={18} color={AppColors.error} />}
        {!isSuccess && !isError && <CheckCircle2 size={18} color={AppColors.primary} />}
        <Text style={styles.messageText}>{message}</Text>
        <TouchableOpacity
          onPress={handleDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <X size={15} color={AppColors.textMuted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 84,
    alignSelf: 'center',
    maxWidth: '90%',
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 9999,
  },
  successToast: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  errorToast: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  messageText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
});
