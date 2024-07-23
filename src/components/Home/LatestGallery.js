import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width*0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.75;

const LatestGallery = ({ bo_table, view_type, rows }) => {
  
  // Dummy data - replace with actual API call
  const dummyData = Array(rows).fill().map((_, index) => ({
    id: index,
    title: `Image ${index + 1}`,
    imageUrl: `https://picsum.photos/seed/${index}/400/300`, // Placeholder images
    date: '24-07-18'
  }));

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>갤러리</Text>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + 10} // Width + marginRight
        decelerationRate="fast"
        pagingEnabled
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