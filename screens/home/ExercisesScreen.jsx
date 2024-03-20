import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useState, useRef } from "react";
import LinearBackground from "../../components/LinearBackground";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-core';
import SearchBox from "../../components/SearchBox";
import InfiniteHits from "../../components/InfiniteHits";
import Filters from "../../components/Filters";

const searchClient = algoliasearch('ZZ7KAXIP59', '115ba3dafb56044172a3f15bfaf3b329');

export default function ExercisesScreen() {
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const listRef = useRef(null);

  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }

  return (
    <LinearBackground containerStyle={styles.container}>
      <InstantSearch searchClient={searchClient} indexName="exercises_search">
        <SearchBox onChange={scrollToTop} />
        <Filters
          isModalOpen={isFilterModalOpen}
          onToggleModal={() => setFilterModalOpen((isOpen) => !isOpen)}
          onChange={scrollToTop}
        />
        <InfiniteHits ref={listRef} />
      </InstantSearch>
    </LinearBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "4%"
  }
})