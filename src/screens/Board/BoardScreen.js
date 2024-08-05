import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchWriteListRequest } from '../../services/api/ServerApi';

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
        { title: "자유게시판", data: freeResponse.data.writes },
        { title: "공지사항", data: noticeResponse.data.writes },
        { title: "갤러리", data: galleryResponse.data.writes },
        { title: "Q&A", data: qaResponse.data.writes },
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
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <BoardWrites title={item.title} data={item.data} />}
    />
  );
};

const BoardWrites = ({ title, data }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.map((item) => (
        <TouchableOpacity
          key={item.wr_id.toString()}
          style={styles.writeContainer}
        >
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
        </TouchableOpacity>
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
  writeContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
});

export default BoardListScreen;