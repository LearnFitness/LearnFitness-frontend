import React, { useCallback } from 'react';
import {
  Modal,
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Pressable,
  FlatList,
} from 'react-native';
import {
  useClearRefinements,
  useRefinementList,
} from 'react-instantsearch-core';

export default function FilterModal({ isOpen, onClose, onChange }) {
  const { items, refine } = useRefinementList({ attribute: 'bodyPart' });
  const { canRefine: canClear, refine: clear } = useClearRefinements();

  const renderCategoryItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: item.isRefined ? '#cee7ff' : 'transparent' }]}
        onPress={() => { refine(item.value); onChange(); }}
      >
        <Text style={[styles.labelText, { fontWeight: item.isRefined ? '700' : '400' }]}>
          {item.label}
        </Text>
        <View style={styles.itemCount}>
          <Text style={styles.itemCountText}>{item.count}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={isOpen} onRequestClose={() => onClose()}>
      <TouchableWithoutFeedback onPress={onClose}>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.container}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Filters</Text>
            </View>
            <FlatList
              data={items}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.value}
              numColumns={2}
              columnWrapperStyle={styles.list}
            />
          </View>
          <View style={styles.filterListButtonContainer}>
            <View style={styles.filterListButton}>
              <Button
                title="Clear all"
                disabled={!canClear}
                onPress={() => { clear(); onChange(); }}
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
    marginTop: 16,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    paddingVertical: 12,
    margin: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  itemCount: {
    backgroundColor: '#252b33',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 5,
  },
  itemCountText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  labelText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  filterListButtonContainer: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
  },
  filterListButton: {
    flex: 1,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#df2420',
  },
});
