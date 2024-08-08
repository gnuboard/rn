import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchWriteListRequest } from '../../services/api/ServerApi';
import WriteListItem from '../../components/Write/WriteListItem';

const PAGE_SIZE = 5;

const BoardListScreen = () => {
  const [boardWrites, setBoardWrites] = useState(null);

  async function getAllBoardWrites() {
    try {
      const freeResponse = await fetchWriteListRequest('free', { page: 1, per_page: PAGE_SIZE });
      const galleryResponse = await fetchWriteListRequest('gallery', { page: 1, per_page: PAGE_SIZE });
      const noticeResponse = await fetchWriteListRequest('notice', { page: 1, per_page: PAGE_SIZE });
      const qaResponse = await fetchWriteListRequest('qa', { page: 1, per_page: PAGE_SIZE });
      
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
  }, []);

  if (!boardWrites) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={boardWrites}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => <BoardWrites title={item.title} bo_table={item.bo_table} data={item.data} />}
    />
  );
};

const BoardWrites = ({ title, bo_table, data }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => navigation.navigate('WriteList', { bo_table })}
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
  },
});

export default BoardListScreen;