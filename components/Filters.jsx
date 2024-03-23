import React from 'react';
import {
  Button,
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Pressable
} from 'react-native';
import {
  useClearRefinements,
  useCurrentRefinements,
  useRefinementList,
} from 'react-instantsearch-core';

export default function Filters({ isOpen, onClose, onChange }) {
  const { items, refine } = useRefinementList({ attribute: 'bodyPart' });
  const { canRefine: canClear, refine: clear } = useClearRefinements();
  const { items: currentRefinements } = useCurrentRefinements();
  const totalRefinements = currentRefinements.reduce(
    (acc, { refinements }) => acc + refinements.length,
    0
  );

  return (
    <Modal animationType="slide" visible={isOpen} presentationStyle="pageSheet">
      <TouchableWithoutFeedback onPress={onClose}>
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.title}>
                <Text style={styles.titleText}>Filters</Text>
              </View>
              <View style={styles.list}>
                {items.map((item) => {
                  const capitalizeFirstLetter = (string) => {
                    return string.replace(/\b\w/g, (char) => char.toUpperCase());
                  };
                  const capitalizedCategory = capitalizeFirstLetter(item.label); // Capitalize first letter of each word
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={{...styles.item, backgroundColor: item.isRefined ? '#e6e6e6' : 'transparent',}}
                      onPress={() => {
                        refine(item.value);
                        onChange();
                      }}
                    >
                      <Text
                        style={{
                          ...styles.labelText,
                          fontWeight: item.isRefined ? '800' : '400',
                        }}
                      >
                        {capitalizedCategory}
                      </Text>
                      <View style={styles.itemCount}>
                        <Text style={styles.itemCountText}>{item.count}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.filterListButtonContainer}>
            <View style={styles.filterListButton}>
              <Button
                title="Clear all"
                color="#252b33"
                disabled={!canClear}
                onPress={() => {
                  clear();
                  onChange();
                }}
              />
            </View>
            <View style={styles.filterListButton}>
              <Button onPress={onClose} title="Apply" color="#252b33" />
            </View>
          </View>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Exit</Text>
          </Pressable>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#ffffff',
  },
  title: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 32,
  },
  list: {
    marginTop: 32,
  },
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  itemCount: {
    backgroundColor: '#252b33',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  itemCountText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  labelText: {
    fontSize: 16,
  },
  filterListButtonContainer: {
    flexDirection: 'row',
  },
  filterListButton: {
    flex: 1,
    alignItems: 'center',
    marginTop: 18,
  },
  modalOverlay: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it appears above other content
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#df2420',
    fontWeight: 'bold',
  },
});
