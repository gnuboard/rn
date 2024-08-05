import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { WriteListToolbar } from '../../../components/Common/Toolbar';
import { fetchWriteListRequest } from '../../../services/api/ServerApi';
import WriteListItem from '../../../components/Write/WriteListItem';
import { useRefresh } from '../../../auth/context/RefreshContext';

const PAGE_SIZE = 10;

const WriteListScreen = ({ route }) => {
  const bo_table = route.params.bo_table;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { refreshing } = useRefresh();

  useEffect(() => {
    loadMorePosts();
  }, [refreshing]);

  const loadMorePosts = async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWriteListRequest(
        bo_table, { page: page, per_page: PAGE_SIZE }
      );
      const newWrites = response.data.writes;
      if (newWrites.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newWrites]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('fetchWriteListRequest - WriteListScreen', error);
    }
  };

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
    <View style={styles.container}>
      <WriteListToolbar bo_table={bo_table} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.wr_id.toString()}
        renderItem={({ item }) => (
          <WriteListItem bo_table={bo_table} item={item} />
        )}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  indicatorFooter: {
    padding: 10,
  },
})

export default WriteListScreen;
