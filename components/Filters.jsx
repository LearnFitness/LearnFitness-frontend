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
          <View style={styles.container}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Filters</Text>
            </View>
            <View style={styles.list}>
              {items.map(item => {
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={{ ...styles.item, backgroundColor: item.isRefined ? '#cee7ff' : 'transparent', }}
                    onPress={() => {
                      refine(item.value);
                      onChange();
                    }}
                  >
                    <Text style={{ ...styles.labelText, fontWeight: item.isRefined ? '700' : '400', }}>
                      {item.label}
                    </Text>
                    <View style={styles.itemCount}>
                      <Text style={styles.itemCountText}>{item.count}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.filterListButtonContainer}>
            <View style={styles.filterListButton}>
              <Button
                title="Clear all"
                disabled={!canClear}
                onPress={() => {
                  clear();
                  onChange();
                }}
              />
            </View>
            <View style={styles.filterListButton}>
              <Button onPress={onClose} title="Apply" />
            </View>
          </View>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
    fontSize: 25,
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
    borderRadius: 5
  },
  itemCount: {
    backgroundColor: '#252b33',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 10,
  },
  itemCountText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  labelText: {
    fontSize: 16,
    textTransform: "capitalize",
    marginHorizontal: 10
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
    left: 10,
    zIndex: 1, // Ensure it appears above other content
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#df2420',
  },
});