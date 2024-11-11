import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { dateToMonthDay, truncateText } from '../../utils/stringFunc';
import { fetchWriteListRequest } from '../../services/api/ServerApi';
import { useWriteRefresh, useWriteListRefresh } from '../../context/writes/RefreshContext';
import { useHandleWrite } from '../../utils/hooks';
import { WritePasswordModal } from '../Modals/Modal';
import { Styles } from '../../styles/styles';

const Latest = ({ title, bo_table, rows }) => {
  const [ boardWrites, setBoardWrites ] = useState([]);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ modalWrId, setModalWrId ] = useState(null);
  const { writeRefresh } = useWriteRefresh();
  const { writeListRefresh } = useWriteListRefresh();
  const { handleReadWrite } = useHandleWrite();
  const navigation = useNavigation();

  useEffect(() => {
    fetchWriteListRequest(bo_table, { 'per_page': rows })
    .then(response => {
      if (Array.isArray(response.data.writes)) {
        setBoardWrites(response.data.writes);
      } else {
        console.error('API response data is not in the expected format:', data);
      }
    })
    .catch(error => {
      console.error('Latest useEffect', JSON.stringify(error));
    })
  }, [writeRefresh, writeListRefresh]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {boardWrites.map((write) => (
        <TouchableOpacity
          key={write.wr_id}
          onPress={() => handleReadWrite(
            bo_table,
            write,
            setModalVisible,
            setModalWrId,
            navigation,
          )}
        >
        <View key={write.wr_id} style={styles.item}>
          <View style={styles.subjectHeader}>
            <View style={styles.titleContainer}>
              {write.wr_option.includes('secret') && <Icon name="lock-closed" size={15} color="#000" />}
              <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
                {truncateText(write.wr_subject, 25)}
              </Text>
            </View>
            <Text style={styles.itemDate}>{dateToMonthDay(write.wr_datetime)}</Text>
          </View>
        </View>
        </TouchableOpacity>
      ))}
      <WritePasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        bo_table={bo_table}
        modalWrId={modalWrId}
      />
    </View>
  );
};

const styles = new Styles.Latest();

export default Latest;