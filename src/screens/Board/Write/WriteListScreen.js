import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { WriteListToolbar } from '../../../components/Common/Toolbar';
import { fetchWriteListRequest } from '../../../services/api/ServerApi';
import WriteListItem from '../../../components/Write/WriteListItem';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/writes/RefreshContext';
import { useCacheWrites } from '../../../context/writes/CacheWritesContext';
import { useSearchWrites } from '../../../context/writes/SearchWritesContext';
import { useTheme } from '../../../context/theme/ThemeContext';

const PAGE_SIZE = 10;

const WriteListScreen = ({ route }) => {
  const bo_table = route.params.bo_table;
  const [ notices, setNotices ] = useState([]);
  const [ writes, setWrites ] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ loading, setLoading ] = useState(false);
  const [ hasMore, setHasMore ] = useState(true);
  const [ refreshing, setRefreshing ] = useState(false);
  const { writeRefresh } = useWriteRefresh();
  const { writeListRefresh, setWriteListRefresh } = useWriteListRefresh();
  const { cacheWrites, setCacheWrites } = useCacheWrites();
  const { isSearchInputActive, searchedWrites } = useSearchWrites();
  const { bgThemedColor } = useTheme();

  useEffect(() => {
    if (cacheWrites[bo_table].writes.length > 0) {
      setPage(cacheWrites[bo_table].page);
      setNotices(cacheWrites[bo_table].notices);
      setWrites(cacheWrites[bo_table].writes);
      return;
    }

    if (writeListRefresh) {
      refreshBoardWrites(bo_table);
      setWriteListRefresh(false);
      setRefreshing(false);
    } else {
      loadMorePosts();
    }
  }, [writeRefresh, writeListRefresh]);

  useEffect(() => {
    if (isSearchInputActive) {
      setWrites(searchedWrites);
    } else {
      setWrites(cacheWrites[bo_table].writes);
    }
  }, [isSearchInputActive, searchedWrites]);

  const loadMorePosts = async () => {
    if (loading || !hasMore || isSearchInputActive) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWriteListRequest(
        bo_table, { page: page, per_page: PAGE_SIZE }
      );
      const newNotices = response.data.notice_writes;
      const newNoticesIds = newNotices.map((notice) => notice.wr_id);
      const newWrites = response.data.writes;
      newNotices.sort((a, b) => b.wr_id - a.wr_id);
      if (newWrites.length > 0) {
        const noticeExcludedWrites = newWrites.filter((write) => !newNoticesIds.includes(write.wr_id));
        setNotices((prevNotices) => {
          for (const notice of newNotices) {
            if (!prevNotices.map((prevNotice) => prevNotice.wr_id).includes(notice.wr_id)) {
              prevNotices.push(notice);
            }
          }
          return prevNotices;
        });
        setWrites((prevWrites) => [...prevWrites, ...noticeExcludedWrites]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
      setLoading(false);
      setCacheWrites(prevCacheWrites => ({
        ...prevCacheWrites,
        [bo_table]: {
          page: page,
          notices: notices,
          writes: writes,
        },
      }));
    } catch (error) {
      console.error('fetchWriteListRequest - WriteListScreen', error);
    }
  };

  const refreshBoardWrites = async (bo_table) => {
    setNotices([]);
    setWrites([]);
    setPage(1);
    setHasMore(true);
    setCacheWrites(prevCacheWrites => ({
      ...prevCacheWrites,
      [bo_table]: {
        page: 1,
        notices: [],
        writes: [],
      },
    }));
  }

  const renderItem = useCallback(({ item }) => (
    <WriteListItem bo_table={bo_table} write={item} />
  ), [bo_table]);

  const renderNotice = useCallback(({ item }) => (
    <WriteListItem style={styles.noticeItem} bo_table={bo_table} write={item} isNotice={true} />
  ), [bo_table]);

  const renderHeader = useCallback(() => (
    <FlatList
      data={notices}
      keyExtractor={(item, index) => `notice-${item.wr_id}-${index}`}
      renderItem={renderNotice}
      scrollEnabled={false}
    />
  ), [notices, renderNotice]);

  const renderFooter = () => {
    return (
      loading && (
        <View style={styles.indicatorFooter}>
          <ActivityIndicator size="large" />
        </View>
      )
    );
  };

  return (
    <View style={[styles.container, bgThemedColor]}>
      <WriteListToolbar bo_table={bo_table} />
      <FlatList
        data={writes}
        keyExtractor={(item, index) => `write-${item.wr_id}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={styles.listHeader}
        ListFooterComponent={renderFooter}
        style={styles.container}
        nestedScrollEnabled={true}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (isSearchInputActive) {
                return;
              }
              refreshBoardWrites(bo_table);
              setWriteListRefresh(true);
              setRefreshing(true);
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  listHeader: {
    backgroundColor: '#FFF6FA',
  },
  noticeItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  indicatorFooter: {
    padding: 10,
  },
})

export default WriteListScreen;
