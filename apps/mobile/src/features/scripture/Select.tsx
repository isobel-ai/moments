import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Text, colors, spacing, radii } from '@moments/ui';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  placeholder: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function Select({
  label,
  placeholder,
  value,
  options,
  onSelect,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.field}>
      <Text variant="caption" color={colors.textSecondary}>
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => setOpen(true)}
      >
        <Text variant="body" color={selected ? colors.text : colors.textMuted}>
          {selected?.label ?? placeholder}
        </Text>
        <Text variant="body" color={colors.textMuted}>
          ▾
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text variant="title" style={styles.sheetTitle}>
              {label}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    variant="body"
                    color={item.value === value ? colors.brand : colors.text}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.surfaceOverlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  sheetTitle: {
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
