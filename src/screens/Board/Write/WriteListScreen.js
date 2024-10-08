import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { WriteListToolbar } from '../../../components/Common/Toolbar';
import { fetchBoardConfigRequest, fetchWriteListRequest } from '../../../services/api/ServerApi';
import WriteListItem from '../../../components/Write/WriteListItem';
import { useAuth } from '../../../context/auth/AuthContext';
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
  const [ isSearched, setIsSearched ] = useState(false);
  const [ writeAllowed, setWriteAllowed ] = useState(false);
  const { getCurrentUserData } = useAuth();
  const { writeRefresh } = useWriteRefresh();
  const { writeListRefresh, setWriteListRefresh } = useWriteListRefresh();
  const { cacheWrites, setCacheWrites } = useCacheWrites();
  const { isSearchInputActive, searchedWrites } = useSearchWrites();
  const { bgThemedColor, textThemedColor } = useTheme();

  useEffect(() => {
    fetchBoardConfigRequest(bo_table)
      .then(response => {
        const boardConfig = response.data;
        getCurrentUserData()
          .then(result => {
            const mbLevel = result.mb_level;
            if (boardConfig.bo_write_level == 1 || (mbLevel && mbLevel >= boardConfig.bo_write_level)) {
              setWriteAllowed(true);
            }
          })
      })
  }, [bo_table]);

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
      setNotices([]);
      setWrites(searchedWrites);
      setIsSearched(true);
    } else {
      setNotices(cacheWrites[bo_table].notices);
      setWrites(cacheWrites[bo_table].writes);
      setIsSearched(false);
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
    <WriteListItem bo_table={bo_table} write={item} isSearched={isSearched} />
  ), [bo_table, isSearched]);

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
      <WriteListToolbar bo_table={bo_table} writeAllowed={writeAllowed} />
      { writes.length > 0 ? (
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
      ) : loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={styles.noWritesContainer}>
            <Text style={[styles.noWritesText, textThemedColor]}>게시글이 없습니다.</Text>
          </View>
        )
      }
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
  noWritesContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWritesText: {
    fontSize: 16,
  }
})

export default WriteListScreen;
