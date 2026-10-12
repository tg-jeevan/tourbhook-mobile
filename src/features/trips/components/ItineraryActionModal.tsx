import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Compass,
  Bookmark,
  Share2,
  FileText,
  Edit3,
} from 'lucide-react-native';
import { CustomModal } from '../../../core/components/CustomModal';
import { ActionOptionRow } from '../../../core/components/ActionOptionRow';
import { AppColors } from '../../../core/theme/colors';
import { ItineraryTrip } from '../data/itineraryStore';

export interface ItineraryActionModalProps {
  visible: boolean;
  itinerary: ItineraryTrip | null;
  onClose: () => void;
  onViewDetails: (itinerary: ItineraryTrip) => void;
  onShare: (itinerary: ItineraryTrip) => void;
  onToggleSave: (itinerary: ItineraryTrip) => void;
  onEdit?: (itinerary: ItineraryTrip) => void;
}

export const ItineraryActionModal: React.FC<ItineraryActionModalProps> = ({
  visible,
  itinerary,
  onClose,
  onViewDetails,
  onShare,
  onToggleSave,
  onEdit,
}) => {
  if (!itinerary) return null;

  const isSaved = itinerary.status === 'saved';

  const headerIcon = (
    <View style={styles.travelBadge}>
      <Compass size={22} color={AppColors.primary} />
    </View>
  );

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      showCloseButton={true}
      showDragHandle={true}
      dismissOnBackdropPress={true}
      headerIcon={headerIcon}
      title={itinerary.customName || itinerary.title}
      subtitle="Choose an action for this itinerary"
    >
      <View style={styles.actionsContainer}>
        {/* Save / Unsave Itinerary */}
        <ActionOptionRow
          icon={
            <Bookmark
              size={18}
              color={AppColors.primary}
              fill={isSaved ? AppColors.primary : 'transparent'}
            />
          }
          title={isSaved ? 'Unsave Itinerary' : 'Save Itinerary'}
          description={
            isSaved
              ? 'Remove from your saved collection'
              : 'Add to your saved collection for quick access'
          }
          onPress={() => {
            onClose();
            onToggleSave(itinerary);
          }}
          testID="action-save-itinerary"
        />

        {/* Share Itinerary */}
        <ActionOptionRow
          icon={<Share2 size={18} color={AppColors.primary} />}
          title="Share Itinerary"
          description="Send trip details and plans to travel companions"
          onPress={() => {
            onClose();
            onShare(itinerary);
          }}
          testID="action-share-itinerary"
        />

        {/* Edit / Modify Itinerary */}
        {onEdit && (
          <ActionOptionRow
            icon={<Edit3 size={18} color={AppColors.primary} />}
            title="Edit Itinerary"
            description="Modify destination, dates, travellers, or preferences"
            onPress={() => {
              onClose();
              onEdit(itinerary);
            }}
            testID="action-edit-itinerary"
          />
        )}

        {/* View Details */}
        <ActionOptionRow
          icon={<FileText size={18} color={AppColors.primary} />}
          title="View Details"
          description="Explore full day-by-day plan and timeline"
          onPress={() => {
            onClose();
            onViewDetails(itinerary);
          }}
          testID="action-view-details"
        />

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  travelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    width: '100%',
    paddingTop: 4,
  },
  cancelBtn: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
});
