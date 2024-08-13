import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { dateToMonthDay, truncateText } from '../../utils/stringFunc';
import { fetchWriteListRequest } from '../../services/api/ServerApi';
import { useWriteRefresh, useWriteListRefresh } from '../../context/writes/RefreshContext';
import { WritePasswordModal } from '../Modals/Modal';
import { readWrite } from '../../utils/writeFunc';

const Latest = ({ title, bo_table, rows }) => {
  const [boardWrites, setBoardWrites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWrId, setModalWrId] = useState(null);
  const { writeRefresh } = useWriteRefresh();
  const { writeListRefresh } = useWriteListRefresh();
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
          onPress={() => readWrite(bo_table, write, setModalVisible, setModalWrId, navigation)}
        >
        <View key={write.wr_id} style={styles.item}>
          <View style={styles.subjectHeader}>
          {write.wr_option.includes('secret') && <Icon name="lock-closed" size={15} color="#000" />}
            <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
              {truncateText(write.wr_subject, 10)}
            </Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  item: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemTitle: {
    fontSize: 14,
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  itemSource: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default Latest;