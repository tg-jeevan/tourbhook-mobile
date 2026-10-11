import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import { AppColors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  showDragHandle?: boolean;
  showCloseButton?: boolean;
  dismissOnBackdropPress?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  headerIcon,
  showDragHandle = true,
  showCloseButton = true,
  dismissOnBackdropPress = true,
  children,
  footer,
  contentContainerStyle,
  cardStyle,
}) => {
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.92)).current;
  const cardTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(cardScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cardScaleAnim, {
          toValue: 0.95,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 15,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropAnim, cardScaleAnim, cardTranslateY]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Animated Semi-Transparent Overlay */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback
            onPress={dismissOnBackdropPress ? onClose : undefined}
          >
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Modal Card with Scale + Translate Entrance */}
        <Animated.View
          style={[
            styles.modalCard,
            cardStyle,
            {
              opacity: backdropAnim,
              transform: [
                { scale: cardScaleAnim },
                { translateY: cardTranslateY },
              ],
            },
          ]}
        >
          {/* Top Drag Handle */}
          {showDragHandle && (
            <View style={styles.dragHandleWrap}>
              <View style={styles.dragHandle} />
            </View>
          )}

          {/* Close Button */}
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
            >
              <X size={18} color={AppColors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Header Icon */}
          {headerIcon && <View style={styles.headerIconWrap}>{headerIcon}</View>}

          {/* Title & Subtitle */}
          {title ? (
            <View style={styles.headerTextWrap}>
              <Text style={styles.titleText} numberOfLines={2}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={styles.subtitleText}>{subtitle}</Text>
              ) : null}
            </View>
          ) : null}

          {/* Body Content */}
          <View style={[styles.bodyContent, contentContainerStyle]}>
            {children}
          </View>

          {/* Footer (Optional) */}
          {footer ? <View style={styles.footerWrap}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.overlayDark,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 12,
    position: 'relative',
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 10,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    zIndex: 10,
  },
  headerIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  headerTextWrap: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '500',
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  bodyContent: {
    width: '100%',
  },
  footerWrap: {
    marginTop: 16,
    width: '100%',
  },
});
