import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import Config from 'react-native-config';
import { fetchWriteListRequest } from '../../services/api/ServerApi';
import { dateToMonthDay } from '../../utils/stringFunc';
import { useNavigation } from '@react-navigation/native';
import { useWriteRefresh, useWriteListRefresh } from '../../context/writes/RefreshContext';
import { WritePasswordModal } from '../Modals/Modal';
import { readWrite } from '../../utils/writeFunc';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width*0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.75;

const LatestGallery = ({ bo_table, view_type, rows }) => {
  const [boardWrites, setBoardWrites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWrId, setModalWrId] = useState(null);
  const { writeRefresh } = useWriteRefresh();
  const { writeListRefresh } = useWriteListRefresh();
  const navigation = useNavigation();

  useEffect(() => {
    fetchWriteListRequest(bo_table, { view_type, rows})
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

  const writeData = boardWrites.map((item) => ({
    wr_id: item.wr_id,
    wr_subject: item.wr_subject,
    wr_option: item.wr_option,
    imageUrl: `${Config.SERVER_URL}/${item.thumbnail.src}`,
    date: dateToMonthDay(item.wr_datetime)
  }));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => readWrite(bo_table, item, setModalVisible, setModalWrId, navigation)}
      activeOpacity={1}
    >
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.wr_subject}
          </Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress = {() => navigation.navigate(
          'Boards',
          {
            screen: 'WriteList',
            params: { bo_table },
            initial: false,
          }
        )}
        activeOpacity={1}
      >
        <Text style={styles.title}>갤러리</Text>
      </TouchableOpacity>
      <FlatList
        data={writeData}
        renderItem={renderItem}
        keyExtractor={item => item.wr_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + 10} // Width + marginRight
        decelerationRate="fast"
        pagingEnabled
      />
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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginRight: 10,
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 8,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default LatestGallery;