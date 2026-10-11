import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AlertTriangle, Trash2 } from 'lucide-react-native';
import { CustomModal } from './CustomModal';
import { AppColors } from '../theme/colors';

export interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
  headerIcon?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  loading = false,
  headerIcon,
}) => {
  const defaultIcon = (
    <View
      style={[
        styles.iconCircle,
        isDestructive ? styles.destructiveIconCircle : styles.standardIconCircle,
      ]}
    >
      {isDestructive ? (
        <Trash2 size={24} color={AppColors.accent} />
      ) : (
        <AlertTriangle size={24} color={AppColors.primary} />
      )}
    </View>
  );

  return (
    <CustomModal
      visible={visible}
      onClose={loading ? () => {} : onClose}
      showCloseButton={!loading}
      showDragHandle={true}
      dismissOnBackdropPress={!loading}
      headerIcon={headerIcon || defaultIcon}
      title={title}
      subtitle={message}
    >
      <View style={styles.buttonRow}>
        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          disabled={loading}
          activeOpacity={0.75}
        >
          <Text style={styles.cancelButtonText}>{cancelText}</Text>
        </TouchableOpacity>

        {/* Confirm Action Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isDestructive
              ? styles.destructiveConfirmButton
              : styles.standardConfirmButton,
            loading && styles.loadingButton,
          ]}
          onPress={onConfirm}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator size="small" color={AppColors.white} />
          ) : (
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  destructiveIconCircle: {
    backgroundColor: '#FFE8E2',
    borderColor: '#FED7AA',
  },
  standardIconCircle: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  confirmButton: {
    flex: 1.2,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  destructiveConfirmButton: {
    backgroundColor: AppColors.accent,
    shadowColor: AppColors.accent,
  },
  standardConfirmButton: {
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
  },
  loadingButton: {
    opacity: 0.85,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.white,
    letterSpacing: -0.2,
  },
});
