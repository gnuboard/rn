import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  useWindowDimensions, TouchableOpacity, Alert
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { fetchBoardConfigRequest } from '../../../services/api/ServerApi';
import Config from 'react-native-config';
import { Colors } from '../../../constants/theme';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/writes/RefreshContext';
import Comment from '../../../components/Write/Comment/Comment';
import { CommentForm } from '../../../components/Write/Comment/CommentForm';
import { fetchWriteRequest, fetchCommentsRequest, deleteWriteRequest } from '../../../services/api/ServerApi';
import { useAuth } from '../../../context/auth/AuthContext';

const WriteScreen = ({ navigation, route }) => {
  const { bo_table, wr_id, isVerified, writeData } = route.params;
  const [ write, setWrite ] = useState(null);
  const [ comments, setComments ] = useState([]);
  const { writeRefresh } = useWriteRefresh();
  const { refreshWriteList } = useWriteListRefresh();
  const { width } = useWindowDimensions();
  const { getCurrentUserData } = useAuth();
  const [ currentMbId, setCurrentMbId ] = useState(null);

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
      fetchWriteTotally();
    }
  }, [bo_table, wr_id, writeData, writeRefresh]);

  async function fetchWriteTotally() {
    try {
      const [ fetchWriteResponse, fetchCommentResponse, currentUserData ] = await Promise.all([
        fetchWriteRequest(bo_table, wr_id),
        fetchCommentsRequest(bo_table, wr_id),
        getCurrentUserData(),
      ]);

      // 게시글
      setWrite(fetchWriteResponse.data);

      // 댓글
      setComments(fetchCommentResponse.data.comments);

      // 현재 사용자 정보
      setCurrentMbId(currentUserData.mb_id);

      // 게시판 설정
      const fetchBoardConfigResponse = await fetchBoardConfigRequest(bo_table);
      const noticeArray = fetchBoardConfigResponse.data.bo_notice.split(',');
      const notice = noticeArray.includes(String(wr_id));
      setWrite(prevState => ({
        ...prevState,
        notice: notice,
      }));
    } catch (error) {
      if (!error.response) {
        console.error("fetchWriteTotally - !error.response", error);
        return;
      }
      if (error.response.status === 404) {
        refreshWriteList(bo_table);
        Alert.alert(
          "Notification",
          "게시물이 존재하지 않습니다.",
          [
            {
              text: "확인",
              onPress: () => {
                navigation.navigate(
                  'Boards',
                  {
                    screen: 'WriteList',
                    params: { bo_table: bo_table },
                    initial: false,
                  }
                );
              },
            },
          ],
          { cancelable: false }
        )
        return;
      }
    }
  }

  if (!write) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subjectWithButton}>
        <Text style={styles.title}>{write?.wr_subject}</Text>
        {currentMbId == write.mb_id ? (
          <View style={styles.bindedButton}>
            <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('WriteUpdate', params={'bo_table': bo_table, 'write': write})}>
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => showDeleteConfirm(
                bo_table, write, navigation, refreshWriteList
              )}>
              <Text style={styles.buttonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        ): null}
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
        {comments.length > 0
        ? comments.map((comment, index) => (
            <Comment
              key={index}
              comment={comment}
              bo_table={bo_table}
              wr_id={wr_id}
              currentMbId={currentMbId}
            />
          ))
        : <Text style={styles.noCommentText}>등록된 댓글이 없습니다.</Text>}
        <CommentForm bo_table={bo_table} wr_id={wr_id} />
      </View>
    </ScrollView>
  );
};

async function deleteWrite(bo_table, write, navigation, refreshWriteList) {
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

    if (response.status === 200) {
      Alert.alert(
        "Notification",
        "게시물이 삭제되었습니다.",
        [
          {
            text: "확인",
            onPress: () => {
              refreshWriteList(bo_table);
              navigation.navigate(
                'Boards',
                {
                  screen: 'WriteList',
                  params: { bo_table: bo_table },
                  initial: false,
                }
              );
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

const showDeleteConfirm = (bo_table, write, navigation, refreshWriteList) => {
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
        onPress: () => deleteWrite(bo_table, write, navigation, refreshWriteList)
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