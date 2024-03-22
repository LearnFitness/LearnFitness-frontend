import { StyleSheet, Platform, StatusBar, View, Pressable, FontAwesome } from "react-native";
import { useState, useRef } from "react";
import LinearBackground from "../../components/LinearBackground";
import { InstantSearch } from 'react-instantsearch-core';
import SearchBox from "../../components/SearchBox";
import InfiniteHits from "../../components/InfiniteHits";
import Filters from "../../components/Filters";
import { searchClient } from "../../utils/AlgoliaSearchClient";

export default function ExercisesScreen() {
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const listRef = useRef(null);

  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <LinearBackground containerStyle={[styles.container, { paddingTop: statusBarHeight }]}>
      <InstantSearch searchClient={searchClient} indexName="exercises_search">
        <View style={styles.searchContainer}>
          <SearchBox onChange={scrollToTop} style={{width: '90%'}} />
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalOpen(!isFilterModalOpen)}
          >
            <FontAwesome name="filter" size={22} color="white" />
          </Pressable>
        </View>
        <Filters isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} onChange={scrollToTop} />
        <InfiniteHits ref={listRef} />
      </InstantSearch>
    </LinearBackground>
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
  },
  filterButton: {
    padding: 10,
  }
})
