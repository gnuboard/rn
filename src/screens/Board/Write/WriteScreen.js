import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { fetchWrite } from '../../../utils/componentsFunc';
import { fetchBoardConfigRequest } from '../../../services/api/ServerApi';
import Config from 'react-native-config';
import { Colors } from '../../../constants/theme';
import { useRefresh } from '../../../auth/context/RefreshContext';
import Comment from '../../../components/Write/Comment/Comment';

const WriteScreen = ({ navigation, route }) => {
  const { bo_table, wr_id } = route.params;
  const [ write, setWrite ] = useState(null);
  const { refreshing } = useRefresh();
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchWrite(bo_table, wr_id, setWrite)
    .then(() => {
      fetchBoardConfigRequest(bo_table)
        .then(response => {
          const noticeArray = response.data.bo_notice.split(',');
          const notice = noticeArray.includes(String(wr_id));
          setWrite(prevState => ({
            ...prevState,
            notice: notice,
          }))
        })
        .catch(error =>console.error("fetchBoardConfigRequest", error));
    })
    .catch(error => console.error("fetchWirte", error));
  }, [refreshing]);

  if (!write) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subjectWithButton}>
        <Text style={styles.title}>{write?.wr_subject}</Text>
        <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('WriteUpdate', params={'bo_table': bo_table, 'write': write})}>
          <Text style={styles.updateButtonText}>수정하기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.metaContainer}>
        <View style={styles.authorAvatar}>
          <Image 
            source={{ uri: `${Config.SERVER_URL}${write?.mb_icon_path}` }} 
            style={styles.avatarImage} 
          />
        </View>
        <View style={styles.metaInfo}>
        <Text style={styles.author}>{write?.wr_name}</Text>
          <Text style={styles.date}>{write?.wr_datetime}</Text>
        </View>
      </View>
      <RenderHTML
        contentWidth={width}
        source={{ html: write?.wr_content }}
      />
      <View style={styles.commentContainer}>
        <Text style={styles.commentHeaderText}>댓글</Text>
        {write.comments.length > 0
        ? write.comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))
        : <Text style={styles.noCommentText}>등록된 댓글이 없습니다.</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  subjectWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_blue,
    borderRadius: 4,
    marginBottom: 16,
  },
  updateButtonText: {
    color: Colors.btn_text_white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5e3aee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaInfo: {
    justifyContent: 'center',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  commentContainer: {
    marginTop: 50,
    paddingBottom: 100,
  },
  commentHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCommentText: {
    textAlign: 'center'
  },
});

export default WriteScreen;