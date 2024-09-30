import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { debounce } from 'lodash';
import { Colors } from '../../constants/theme';
import { useSearchWrites } from '../../context/writes/SearchWritesContext';
import { searchBoardWritesRequest } from '../../services/api/ServerApi';

export const SearchInput = ({ onetable }) => {
  const { isSearchInputActive, setSearchedWrites } = useSearchWrites();
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ searchedData, setSearchedData ] = useState({
    onetable,
    page: 1,
    per_page: 10,
    stx: '',
  });

  useEffect(() => {
    if (!isSearchInputActive) {
      setSearchTerm('');
      setSearchedWrites([]);
    }
  }, [isSearchInputActive]);

  useEffect(() => {
    debouncedSearch(searchedData);
  }, [searchedData])

  const debouncedSearch = useCallback(
    debounce(async (searchData) => {
      const response = await searchBoardWritesRequest(searchData);
      setSearchedWrites(response.data.search_results);
    }, 1000),
    []
  );

  const handleTextChange = (text) => {
    setSearchTerm(text);
    setSearchedData({
      ...searchedData,
      stx: text,
    });
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