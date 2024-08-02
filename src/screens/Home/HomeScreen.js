import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Latest from '../../components/Home/Latest';
import LatestGallery from '../../components/Home/LatestGallery';

const HomeScreen = () => {
  const navigation = useNavigation();
  const handleItemPress = ({ bo_table, wr_id }) => {
    navigation.navigate('Write', { bo_table, wr_id });
  }

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Icon name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>그누보드</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.column}
              onPress={() => navigation.navigate('WriteList', params={'bo_table': 'free'})}
              activeOpacity={1}
            >
              <Latest title="자유게시판" bo_table="free" rows={2} onItemPress={handleItemPress} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.column}
              onPress={() => navigation.navigate('WriteList', params={'bo_table': 'notice'})}
              activeOpacity={1}
            >
              <Latest title="공지사항" bo_table="notice" rows={2} onItemPress={handleItemPress} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.column}
            onPress={() => navigation.navigate('WriteList', params={'bo_table': 'gallery'})}
            activeOpacity={1}
          >
            <LatestGallery bo_table="gallery" view_type="write" rows={4} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    left: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});

export default HomeScreen;