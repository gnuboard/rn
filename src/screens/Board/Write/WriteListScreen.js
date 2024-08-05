import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WriteListToolbar } from '../../../components/Common/Toolbar';
import { fetchWriteListRequest } from '../../../services/api/ServerApi';

const PAGE_SIZE = 10;

const WriteListScreen = ({ route }) => {
  const bo_table = route.params.bo_table;
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
          <View style={styles.writeContainer}>
            <View style={styles.writeMainContainer}>
              {item.wr_option.includes('secret') && <Icon name="lock-closed" size={15} color="#000" style={styles.wrMainArg} />}
              <Text style={styles.wrMainArg}>{item.wr_subject}</Text>
              {item.wr_comment > 0 && <Text style={[styles.wrMainArg, styles.wrCommentText]}> {item.wr_comment}</Text>}
              {item.wr_link1 && <Icon name="link" style={[styles.wrMainArg, styles.wrLink]} />}
              {(item.normal_files.length > 0 || item.images.length > 0) && <Icon name="download" style={[styles.wrMainArg, styles.wrFile]} />}
            </View>
            <View style={styles.writeSubContainer}>
              <Text style={styles.wrSubArg}>{item.wr_name}</Text>
              <Text style={styles.wrSubArg}>조회수 {item.wr_hit}</Text>
              <Text style={styles.wrSubArg}>추천 {item.good}</Text>
              <Text style={styles.wrSubArg}>비추 {item.nogood}</Text>
              <Text style={styles.wrSubArg}>
                {(() => {
                  const date = new Date(item.wr_datetime);
                  return date.toISOString().slice(2, 10).replace(/-/g, '-');
                })()}
              </Text>
            </View>
          </View>
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
  writeContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  indicatorFooter: {
    padding: 10,
  },
  writeMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  wrMainArg: {
    marginRight: 5,
  },
  writeSubContainer: {
    flexDirection: 'row',
  },
  wrSubArg: {
    marginRight: 10,
    fontSize: 11,
  },
  wrCommentText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#cbe3e8',
    width: 16,
    height: 16,
    fontSize: 11,
  },
  wrLink: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#edd3fd',
    width: 16,
    height: 16,
    fontSize: 11,
  },
  wrFile: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#ffefb9',
    width: 16,
    height: 16,
    fontSize: 11,
  },
})

export default WriteListScreen;
