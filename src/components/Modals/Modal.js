import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity
} from 'react-native';
import { Colors } from '../../styles/colors';
import {
  fetchSecretCommentRequest, fetchSecretWriteRequest
} from '../../services/api/ServerApi';
import { useNavigation } from '@react-navigation/native';
import { Styles } from '../../styles/styles';

const ModalComponent = ({ title, visible, password, setPassword, handlePasswordSubmit, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalDescription}>{title}의 비밀번호를 입력해주세요</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={setPassword}
            value={password}
            placeholder={`${title} 비밀번호`}
            placeholderTextColor={Colors.text_placeholder_black}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handlePasswordSubmit}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export const WritePasswordModal = ({
  visible, onClose, bo_table, modalWrId, comment_id, commentPage
}) => {
  const [ password, setPassword ] = useState('');
  const navigation = useNavigation();

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetchSecretWriteRequest(bo_table, modalWrId, password);
      const writeData = response.data;
      navigation.navigate(
        'Boards',
        {
          screen: 'Write',
          params: {
            bo_table,
            wr_id: modalWrId,
            isVerified: true,
            writeData,
            comment_id,
            commentPage,
          },
          initial: false,
        }
      );
      onClose();
      setPassword('');
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) {
        alert(error.response.data.error.description);
      }
    }
  };

  return (
    <ModalComponent
      title="게시글"
      visible={visible}
      password={password}
      setPassword={setPassword}
      handlePasswordSubmit={handlePasswordSubmit}
      onClose={onClose}
    />
  )
};

export const CommentPasswordModal = ({
  visible,
  onClose,
  setIsSecretCommentVisible,
  setSecretCommentContent,
  bo_table,
  wr_id,
  comment_id,
}) => {
  const [ password, setPassword ] = useState('');

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetchSecretCommentRequest(bo_table, wr_id, comment_id, password);
      const writeData = response.data;
      setSecretCommentContent(writeData.comments[0].save_content);
      setIsSecretCommentVisible(true);
      onClose();
      setPassword('');
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) {
        alert(error.response.data.error.description);
      }
    }
  };

  return (
    <ModalComponent
      title="댓글"
      visible={visible}
      password={password}
      setPassword={setPassword}
      handlePasswordSubmit={handlePasswordSubmit}
      onClose={onClose}
    />
  )
};

const styles = new Styles.Modal();