import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  useWindowDimensions, TouchableOpacity, Alert
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { fetchWrite } from '../../../utils/componentsFunc';
import { fetchBoardConfigRequest } from '../../../services/api/ServerApi';
import Config from 'react-native-config';
import { Colors } from '../../../constants/theme';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/refresh/write/RefreshContext';
import Comment from '../../../components/Write/Comment/Comment';
import { CommentForm } from '../../../components/Write/Comment/CommentForm';
import { deleteWriteRequest } from '../../../services/api/ServerApi';

const WriteScreen = ({ navigation, route }) => {
  const { bo_table, wr_id, isVerified, writeData } = route.params;
  const [ write, setWrite ] = useState(null);
  const { writeRefresh } = useWriteRefresh();
  const { setWriteListRefresh } = useWriteListRefresh();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (isVerified) {
      setWrite(writeData);
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
    } else {
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
    }
  }, [bo_table, wr_id, writeData, writeRefresh]);

  if (!write) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subjectWithButton}>
        <Text style={styles.title}>{write?.wr_subject}</Text>
        <View style={styles.bindedButton}>
          <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('WriteUpdate', params={'bo_table': bo_table, 'write': write})}>
            <Text style={styles.buttonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => showDeleteConfirm(bo_table, write, navigation, setWriteListRefresh)}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
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
        <CommentForm bo_table={bo_table} wr_id={wr_id} />
      </View>
    </ScrollView>
  );
};

async function deleteWrite(bo_table, write, navigation, setWriteListRefresh) {
  let wr_password;

  if (!write.mb_id) {
    // wr_password = prompt('비회원 게시글 삭제시 비밀번호가 필요합니다.'); // prompt is not supported in React Native
    if (!wr_password) {
      return;
    }
  }

  try {
    let response;
    if (write.mb_id) {
      response = await deleteWriteRequest(bo_table, write.wr_id);
    } else {
      // response = await deleteNoneMemberWriteRequest(bo_table, write.wr_id, wr_password); // deleteNoneMemberWriteRequest is not implemented
    }

    if (response.data.result === 'deleted') {
      Alert.alert(
        "Notification",
        "게시물이 삭제되었습니다.",
        [
          {
            text: "확인",
            onPress: () => {
              setWriteListRefresh(true);
              navigation.navigate('WriteList', {'bo_table': bo_table});
            },
          },
        ],
        { cancelable: false }
      );
    }
  } catch (error) {
    console.error(error);
    if (error.response.status === 403) {
      alert(error.response.data.detail);
    }
  }
}

const showDeleteConfirm = (bo_table, write, navigation, setWriteListRefresh) => {
  Alert.alert(
    "Confirmation",
    "정말 삭제하시겠습니까?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled"),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => deleteWrite(bo_table, write, navigation, setWriteListRefresh)
      }
    ],
    { cancelable: false }
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
    marginRight: 10,
  },
  buttonText: {
    color: Colors.btn_text_white,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_gray,
    borderRadius: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bindedButton: {
    flexDirection: 'row',
    alignItems: 'center',
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