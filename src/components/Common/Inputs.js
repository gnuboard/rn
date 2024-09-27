import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { debounce } from 'lodash';
import { Colors } from '../../constants/theme';
import { useSearchWrites } from '../../context/writes/SearchWritesContext';

export const SearchInput = () => {
  const { isSearchInputActive } = useSearchWrites();
  const [ searchTerm, setSearchTerm ] = useState('');

  useEffect(() => {
    if (!isSearchInputActive) {
      setSearchTerm('');
    }
  }, [isSearchInputActive]);

  const debouncedSearch = useCallback(
    debounce((text) => {
      console.log(text);  // TODO: 검색 API 호출
    }, 1000),
    []
  );

  const handleTextChange = (text) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  return (
    <View>
      <TextInput
        style={[
          styles.searchInput,
          !isSearchInputActive && {display: 'none'}
        ]} 
        value={searchTerm}
        onChangeText={handleTextChange}
        placeholder="게시글 검색"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginTop: 15,
    marginHorizontal: 8,
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border_gray,
  },
});