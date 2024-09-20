import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommentForm } from './CommentForm';
import { Colors } from '../../../constants/theme';
import { deleteCommentRequest } from '../../../services/api/ServerApi';
import { useWriteRefresh } from '../../../context/writes/RefreshContext';
import { useTheme } from '../../../context/theme/ThemeContext';
import { getMemberIconUri } from '../../../utils/fileFunc';
import { CommentPasswordModal } from '../../Modals/Modal';
import { getReplyPrefix } from '../../../utils/writeFunc';

function Comment({ comment, bo_table, wr_id, currentMbId }) {
  const [ itemVisible, setItemVisible ] = useState(false);
  const [ isEditFormVisible, setIsEditFormVisible ] = useState(false);
  const [ isUpdateComment, setIsUpdateComment ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ isSecretCommentVisible, setIsSecretCommentVisible ] = useState(false);
  const [ secretCommentContent, setSecretCommentContent ] = useState(false);
  const { writeRefresh, setWriteRefresh } = useWriteRefresh();
  const { getThemedTextColor, textThemedColor } = useTheme();

  async function deleteComment() {
    Alert.alert(
      '댓글 삭제',
      '정말로 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            setItemVisible(false);
            deleteCommentRequest(bo_table, wr_id, comment.wr_id)
            .then(() => setWriteRefresh(!writeRefresh))
            .catch((error) => {
              Alert.alert(
                '댓글 삭제 실패',
                error.response.data.error.description,
                [{ text: '확인' }],
                { cancelable: false },
              )
              console.error('댓글 삭제 실패', error);
            });
          },
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <View style={[styles.container, { marginLeft: comment.wr_comment_reply.length * 10 }]}>
      <View style={styles.divider} />
      <View style={styles.commentHeader}>
        <Text style={textThemedColor}>
          {getReplyPrefix(comment.wr_comment_reply)}
        </Text>
        <Image
          style={styles.avatar}
          source={{ uri: getMemberIconUri(comment) }}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentInfo}>
            <Text style={[styles.authorName, textThemedColor]}>{comment.wr_name}</Text>
            <Text style={[styles.dateTime, textThemedColor]}>{comment.wr_datetime}</Text>
          </View>
          <View style={styles.commentBody}>
            {comment.is_secret ? (
              <>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <View
                    style={[
                      styles.secretComment,
                      {display: isSecretCommentVisible ? "none" : "flex"}
                    ]}
                  >
                    <Icon name="lock-closed" size={16} color={getThemedTextColor()} />
                    <Text style={[styles.commentText, textThemedColor]}>{comment.save_content}</Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={[
                    styles.secretComment,
                    {display: isSecretCommentVisible ? "flex" : "none"}
                  ]}
                >
                  <Icon name="lock-closed" size={16} color={getThemedTextColor()} />
                  <Text style={[styles.commentText, textThemedColor]}>{secretCommentContent}</Text>
                </View>
              </>
            ) : (
              <Text style={[styles.commentText, textThemedColor]}>{comment.save_content}</Text>
            )}
          </View>
        </View>
        {itemVisible && (
          <View>
            <TouchableOpacity
              style={[styles.button, styles.replyButton]}
              onPress={() => {
                setIsUpdateComment(false);
                setIsEditFormVisible(!isEditFormVisible);
              }}
            >
              <Text style={styles.buttonText}>답변</Text>
            </TouchableOpacity>
            {currentMbId == comment.mb_id ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={() => {
                    setIsUpdateComment(true);
                    setIsEditFormVisible(!isEditFormVisible);
                  }}
                >
                  <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={deleteComment}
                >
                  <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </>
            ): null}
          </View>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={() => setItemVisible(!itemVisible)}>
          <Icon name="ellipsis-vertical" size={20} color={getThemedTextColor()} />
        </TouchableOpacity>
      </View>
      {isEditFormVisible &&(
        <CommentForm
          bo_table={bo_table}
          wr_id={wr_id}
          comment={comment}
          setIsEditFormVisible={setIsEditFormVisible}
          isUpdateComment={isUpdateComment}
        />
      )}
      <CommentPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        setIsSecretCommentVisible={setIsSecretCommentVisible}
        setSecretCommentContent={setSecretCommentContent}
        bo_table={bo_table}
        wr_id={wr_id}
        comment_id={comment.wr_id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  authorName: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  dateTime: {
    fontSize: 12,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
  },
  replyButton: {
    backgroundColor: Colors.btn_green,
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: Colors.btn_blue,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: Colors.btn_gray,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  commentBody: {
    marginTop: 5,
  },
  secretComment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    marginLeft: 5,
  },
});

export default Comment;