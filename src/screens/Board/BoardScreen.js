import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchWriteListRequest } from '../../services/api/ServerApi';
import { useWriteListRefresh } from '../../context/writes/RefreshContext';
import { useTheme } from '../../context/theme/ThemeContext';
import { Styles } from '../../styles/styles';
import WriteListItem from '../../components/Write/WriteListItem';

const PAGE_SIZE = 5;

const BoardListScreen = () => {
  const [ boardWrites, setBoardWrites ] = useState(null);
  const { writeListRefresh } = useWriteListRefresh();
  const { bgThemedColor, textThemedColor } = useTheme();

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
      <View style={[styles.container, bgThemedColor]}>
        <Text style={[styles.loading_text, textThemedColor]}>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.container, bgThemedColor]}
      data={boardWrites}
      keyExtractor={(item, index) => `${item.bo_table}-${item.wr_id}-${index}`}
      renderItem={({ item }) => <BoardWrites title={item.title} bo_table={item.bo_table} data={item.data} />}
    />
  );
};

const BoardWrites = ({ title, bo_table, data }) => {
  const navigation = useNavigation();
  const { bgThemedColor, textThemedColor } = useTheme();

  return (
    <View style={[styles.section, bgThemedColor]}>
      <TouchableOpacity
        style={styles.sectionTitleButton}
        onPress={() => navigation.navigate(
          'Boards',
          {
            screen: 'WriteList',
            params: { bo_table },
            initial: false,
          }
        )}
      >
        <Text style={[styles.sectionTitle, textThemedColor]}>{title}</Text>
      </TouchableOpacity>
      {data.map((write) => (
        <WriteListItem key={write.wr_id.toString()} bo_table={bo_table} write={write} />
      ))}
    </View>
  );
}

const styles = new Styles.BoardScreen();

export default BoardListScreen;