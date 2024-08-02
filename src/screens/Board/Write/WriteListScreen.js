import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { WriteListToolbar } from '../../../components/Common/Toolbar';

const PAGE_SIZE = 10;

const fetchPosts = async (page) => {
  // Replace this with your actual data fetching logic
  // Example: return fetch(`https://api.example.com/posts?page=${page}&limit=${PAGE_SIZE}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPosts = Array.from({ length: PAGE_SIZE }, (_, i) => ({
        id: (page - 1) * PAGE_SIZE + i + 1,
        title: `Post ${(page - 1) * PAGE_SIZE + i + 1}`,
      }));
      resolve(newPosts);
    }, 1000);
  });
};

const WriteListScreen = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadMorePosts();
  }, []);

  const loadMorePosts = async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    const newPosts = await fetchPosts(page);
    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  const renderFooter = () => {
    return (
      loading && (
        <View style={{ padding: 10 }}>
          <ActivityIndicator size="large" />
        </View>
      )
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <WriteListToolbar />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{item.title}</Text>
          </View>
        )}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default WriteListScreen;
