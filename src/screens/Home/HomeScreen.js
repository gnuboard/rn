import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Latest from '../../components/Home/Latest';
import LatestGallery from '../../components/Home/LatestGallery';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>그누보드</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Latest title="자유게시판" bo_table="free" rows={2} />
            </View>
            <View style={styles.column}>
              <Latest title="공지사항" bo_table="notice" rows={2} />
            </View>
          </View>
          <LatestGallery bo_table="gallery" view_type="write" rows={4} />
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
  titleContainer: {
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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