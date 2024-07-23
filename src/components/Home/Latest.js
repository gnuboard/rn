import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Latest = ({ title, bo_table, rows }) => {
  // Dummy data - replace with actual API call
  const dummyData = Array(rows).fill().map((_, index) => ({
    id: index,
    title: `Post ${index + 1}`,
    date: '7/23',
    source: bo_table
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {dummyData.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.subjectHeader}>
            <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
          <Text style={styles.itemSource}>from {bo_table}</Text>
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