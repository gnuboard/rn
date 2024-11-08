import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { fetchWriteListRequest } from '../../services/api/ServerApi';
import { dateToMonthDay } from '../../utils/stringFunc';
import { useNavigation } from '@react-navigation/native';
import { useWriteRefresh, useWriteListRefresh } from '../../context/writes/RefreshContext';
import { useTheme } from '../../context/theme/ThemeContext';
import { useHandleWrite } from '../../utils/hooks';
import { WritePasswordModal } from '../Modals/Modal';
import no_image_available from '../../assets/img/commons/no_image_available.jpg';
import { Styles } from '../../styles/styles';

const LatestGallery = ({ bo_table, view_type, rows }) => {
  const [ boardWrites, setBoardWrites ] = useState([]);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ modalWrId, setModalWrId ] = useState(null);
  const { writeRefresh } = useWriteRefresh();
  const { writeListRefresh } = useWriteListRefresh();
  const navigation = useNavigation();
  const { textThemedColor } = useTheme();
  const { handleReadWrite } = useHandleWrite();

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
    imageUrl: `${item.thumbnail.src}`,
    date: dateToMonthDay(item.wr_datetime)
  }));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleReadWrite(
        bo_table,
        item,
        setModalVisible,
        setModalWrId,
        navigation,
      )}
      activeOpacity={1}
    >
      <View style={styles.itemContainer}>
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : no_image_available}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={[styles.itemTitle, textThemedColor]} numberOfLines={1} ellipsizeMode="tail">
            {item.wr_subject}
          </Text>
          <Text style={[styles.itemDate, textThemedColor]}>{item.date}</Text>
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
        <Text style={[styles.title, textThemedColor]}>갤러리</Text>
      </TouchableOpacity>
      <FlatList
        data={writeData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `galley-${item.wr_id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={Styles.ITEM_WIDTH + 10} // Width + marginRight
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

const styles = new Styles.LatestGallery();

export default LatestGallery;