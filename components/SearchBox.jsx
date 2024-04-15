import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSearchBox } from 'react-instantsearch-core';
import { Input } from '@rneui/themed';

export default function SearchBox({ onChange, ...props }) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef(null);

  function setQuery(newQuery) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  // Track when the InstantSearch query changes to synchronize it with the React state.
  // We bypass the state update if the input is focused to avoid concurrent updates when typing.
  if (query !== inputValue && !inputRef.current?.focus()) {
    setInputValue(query);
  }

  return (
    <View style={styles.container}>
      <Input
        ref={inputRef}
        inputContainerStyle={styles.input}
        value={inputValue}
        onChangeText={(newValue) => {
          setQuery(newValue);
          onChange(newValue);
        }}
        clearButtonMode="while-editing"
        placeholder="Search"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        leftIcon={{ type: "font-awesome", name: "search", size: 18 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 10,
    width: '90%',
  },
  input: {
    height: 50,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 7
  },
});