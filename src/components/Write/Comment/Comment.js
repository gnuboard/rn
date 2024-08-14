import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommentForm } from './CommentForm';
import { Colors } from '../../../constants/theme';

function Comment({ comment, bo_table, wr_id, currentMbId }) {
  const [ itemVisible, setItemVisible ] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  return (
    <View style={[styles.container, { marginLeft: comment.wr_comment_reply.length * 10 }]}>
      <View style={styles.divider} />
      <View style={styles.commentHeader}>
        {comment.wr_comment_reply.length > 0 && (
          <Icon name="arrow-forward-outline" size={24} color="#000" />
        )}
        <Image
          style={styles.avatar}
          source={{ uri: `${Config.SERVER_URL}${comment?.mb_icon_path}` }} 
        />
        <View style={styles.commentContent}>
          <View style={styles.commentInfo}>
            <Text style={styles.authorName}>{comment.wr_name}</Text>
            <Text style={styles.dateTime}>{comment.wr_datetime}</Text>
          </View>
          <View style={styles.commentBody}>
            {comment.is_secret ? (
              <TouchableOpacity onPress={() => console.log("비밀댓글 조회 함수 필요")}>
                <View style={styles.secretComment}>
                  <Icon name="lock-closed" size={16} color="#757575" />
                  <Text style={styles.commentText}>{comment.save_content}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.commentText}>{comment.save_content}</Text>
            )}
          </View>
        </View>
        {itemVisible && (
          <View>
            <TouchableOpacity
              style={[styles.button, styles.replyButton]}
              onPress={() => setIsEditFormVisible(!isEditFormVisible)}
            >
              <Text style={styles.buttonText}>답변</Text>
            </TouchableOpacity>
            {currentMbId == comment.mb_id ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={() => console.log("댓글 수정 창 열기")}
                >
                  <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => console.log("댓글 삭제 함수 필요", comment.mb_id)}
                >
                  <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </>
            ): null}
          </View>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={() => setItemVisible(!itemVisible)}>
          <Icon name="ellipsis-vertical" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {isEditFormVisible &&(
        <CommentForm
          bo_table={bo_table}
          wr_id={wr_id}
          comment_id={comment.wr_id}
          setIsEditFormVisible={setIsEditFormVisible}
        />
      )}
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
    color: '#757575',
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