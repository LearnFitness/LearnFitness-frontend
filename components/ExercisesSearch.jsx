import { StyleSheet, View, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { InstantSearch } from 'react-instantsearch-core';
import SearchBox from "./SearchBox";
import InfiniteHits from "./InfiniteHits";
import FilterModal from "./FilterModal";
import { searchClient } from "../utils/AlgoliaSearchClient";

export default function ExercisesSearch() {
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isFilterPressed, setFilterPressed] = useState(false);
  const listRef = useRef(null);

  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }

  return (
    <InstantSearch searchClient={searchClient} indexName="exercises_search" future={{ preserveSharedStateOnUnmount: true }}>
      <View style={styles.searchContainer}>
        <SearchBox onChange={scrollToTop} style={{ width: '90%' }} />
        <Pressable
          style={[styles.filterButton, isFilterPressed && styles.filterButtonPressed]}
          onPress={() => {
            setFilterPressed(true);
            setFilterModalOpen(!isFilterModalOpen);
          }}
          onPressOut={() => setFilterPressed(false)}
        >
          <FontAwesome name="filter" size={22} color="white" />
        </Pressable>
      </View>
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} onChange={scrollToTop} />
      <InfiniteHits ref={listRef} />
    </InstantSearch>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "4%"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  filterButton: {
    padding: 10,
    top: 3,
  },
  filterButtonPressed: {
    opacity: 0.7,
  }
})