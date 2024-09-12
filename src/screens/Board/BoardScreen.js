import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchWriteListRequest } from '../../services/api/ServerApi';
import { useWriteListRefresh } from '../../context/writes/RefreshContext';
import WriteListItem from '../../components/Write/WriteListItem';
import { Colors } from '../../constants/theme';

const PAGE_SIZE = 5;

const BoardListScreen = () => {
  const [ boardWrites, setBoardWrites ] = useState(null);
  const { writeListRefresh } = useWriteListRefresh();

  async function getAllBoardWrites() {
    try {
      const [freeResponse, galleryResponse, noticeResponse, qaResponse] = await Promise.all([
        fetchWriteListRequest('free', { page: 1, per_page: PAGE_SIZE }),
        fetchWriteListRequest('gallery', { page: 1, per_page: PAGE_SIZE }),
        fetchWriteListRequest('notice', { page: 1, per_page: PAGE_SIZE }),
        fetchWriteListRequest('qa', { page: 1, per_page: PAGE_SIZE }),
      ]);

      setBoardWrites([
        { title: "자유게시판", bo_table: "free", data: freeResponse.data.writes },
        { title: "공지사항", bo_table: "notice", data: noticeResponse.data.writes },
        { title: "갤러리", bo_table: "gallery", data: galleryResponse.data.writes },
        { title: "Q&A", bo_table: "qa", data: qaResponse.data.writes },
      ]);
    } catch (error) {
      console.error('getAllBoardWrites - BoardListScreen', error);
    }
  }

  useEffect(() => {
    getAllBoardWrites();
  }, [writeListRefresh]);

  if (!boardWrites) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading_text}>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={boardWrites}
      keyExtractor={(item, index) => `${item.bo_table}-${item.wr_id}-${index}`}
      renderItem={({ item }) => <BoardWrites title={item.title} bo_table={item.bo_table} data={item.data} />}
    />
  );
};

const BoardWrites = ({ title, bo_table, data }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => navigation.navigate(
          'Boards',
          {
            screen: 'WriteList',
            params: { bo_table },
            initial: false,
          }
        )}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </TouchableOpacity>
      {data.map((write) => (
        <WriteListItem key={write.wr_id.toString()} bo_table={bo_table} write={write} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: Colors.text_black,
  },
  loading_text: {
    fontSize: 24,
    color: Colors.text_black,
  },
});

export default BoardListScreen;