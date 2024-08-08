import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { Colors } from '../../constants/theme';

export const WritePasswordModal = ({ visible, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = () => {
    onSubmit(password);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>게시글의 비밀번호를 입력해주세요</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={setPassword}
            value={password}
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
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textInput: {
    width: 200,
    height: 40,
    marginVertical: 15,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    width: '33%',
    padding: 10
  },
  buttonText: {
    color: Colors.btn_text_white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.btn_blue,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: Colors.btn_gray,
  }
});