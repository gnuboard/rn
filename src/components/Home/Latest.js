import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchBoardNewDataRequest } from '../../services/api/ServerApi';
import { dateToMonthDay, truncateText } from '../../utils/stringFunc';

const Latest = ({ title, bo_table, rows }) => {
  const [boardWrites, setBoardWrites] = useState([]);

  async function fetchBoardNewData(bo_table, rows) {
    try {
      const response = await fetchBoardNewDataRequest(bo_table, { rows });
      const data = response.data;
      if (Array.isArray(data)) {
        setBoardWrites(data);
      } else {
        console.error('API response data is not in the expected format:', data);
      }
    } catch(error) {
      console.error(JSON.stringify(error));
    }
  }

  useEffect(() => {
    fetchBoardNewData(bo_table, rows);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {boardWrites.map((write) => (
        <View key={write.wr_id} style={styles.item}>
          <View style={styles.subjectHeader}>
            <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
              {truncateText(write.wr_subject, 10)}
            </Text>
            <Text style={styles.itemDate}>{dateToMonthDay(write.wr_datetime)}</Text>
          </View>
        </View>
      ))}
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