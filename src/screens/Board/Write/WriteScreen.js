import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { fetchWrite } from '../../../utils/componentsFunc';
import Config from 'react-native-config';
import { Colors } from '../../../constants/theme';

const WriteScreen = ({ navigation, route }) => {
  const {bo_table, wr_id} = route.params;
  const [ write, setWrite ] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchWrite(bo_table, wr_id, setWrite);
  }, []);

  if (!write) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subjectWithButton}>
        <Text style={styles.title}>{write?.wr_subject}</Text>
        <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('WriteUpdate', params={wr_id: wr_id})}>
          <Text style={styles.updateButtonText}>수정하기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.metaContainer}>
        <View style={styles.authorAvatar}>
          <Image 
            source={{ uri: `${Config.SERVER_URL}${write?.mb_icon_path}` }} 
            style={styles.avatarImage} 
          />
        </View>
        <View style={styles.metaInfo}>
        <Text style={styles.author}>{write?.wr_name}</Text>
          <Text style={styles.date}>{write?.wr_datetime}</Text>
        </View>
      </View>
      <RenderHTML
        contentWidth={width}
        source={{ html: write?.wr_content }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  subjectWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_blue,
    borderRadius: 4,
    marginBottom: 16,
  },
  updateButtonText: {
    color: Colors.btn_text_white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5e3aee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaInfo: {
    justifyContent: 'center',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default WriteScreen;