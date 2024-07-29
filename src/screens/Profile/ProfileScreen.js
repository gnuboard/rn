import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  SafeAreaView, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { removeQuotes } from '../../utils/stringFunc';
import { useAuth } from '../../auth/context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { isLoggedIn } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const keys = [
          'mb_id',
          'mb_nick',
          'mb_email',
          'mb_point',
          'mb_profile',
          'mb_icon_path',
          'mb_image_path',
          'mb_name',
          'mb_memo_cnt',
          'mb_scrap_cnt',
        ];
        const results = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(
          results.map(([key, value]) => [key, removeQuotes(value)])
        );
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로그인이 필요합니다.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('로그인')}>
          <Text style={styles.buttonText}>로그인하러 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={{ uri: `${Config.SERVER_URL}${profileData.mb_image_path}` }}
            style={styles.coverImage}
          />
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: `${Config.SERVER_URL}${profileData.mb_icon_path}` }}
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profileData.mb_name}</Text>
          <Text style={styles.username}>@{profileData.mb_nick}</Text>
          <Text style={styles.bio}>{profileData.mb_profile}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRowContainer}>
              <Text style={styles.detailLabel}>ID</Text>
              <Text style={styles.detailValue}>{profileData.mb_id}</Text>
            </View>
            <View style={styles.detailRowContainer}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{profileData.mb_email}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.mb_point}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.mb_memo_cnt}</Text>
              <Text style={styles.statLabel}>Memos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.mb_scrap_cnt}</Text>
              <Text style={styles.statLabel}>Scraps</Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProfileUpdate', profileData)}>
            <Text style={styles.buttonText}>정보 수정하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
  header: {
    height: 150,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#fff',
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  infoContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginBottom: 20,
  },
  detailRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 50,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  }
});

export default ProfileScreen;