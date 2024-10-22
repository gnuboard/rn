import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  SafeAreaView, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeQuotes, adaptLineBreaks } from '../../utils/stringFunc';
import { useAuth } from '../../context/auth/AuthContext';
import { useTheme } from '../../context/theme/ThemeContext';
import { Colors } from '../../constants/theme';
import { getMemberIconUri, getMemberImageUri } from '../../utils/fileFunc';
import { profileKeys } from '../../constants/profile';

const ProfileScreen = ({ navigation }) => {
  const { isLoggedIn } = useAuth();
  const { bgThemedColor, textThemedColor } = useTheme();
  const [ profileData, setProfileData ] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const results = await AsyncStorage.multiGet(profileKeys);
        const data = Object.fromEntries(
          results.map(([key, value]) => [key, removeQuotes(value)])
        );
        data.mb_profile = adaptLineBreaks(data.mb_profile);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <View style={[styles.loadingContainer, bgThemedColor]}>
        <Text style={[styles.loadingText, textThemedColor]}>로그인이 필요합니다.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('로그인')}>
          <Text style={styles.buttonText}>로그인하러 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={[styles.loadingContainer, bgThemedColor]}>
        <Text style={[styles.loadingText, textThemedColor]}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, bgThemedColor]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={{ uri: getMemberImageUri(profileData) }}
            style={styles.coverImage}
          />
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: getMemberIconUri(profileData) }}
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.name, textThemedColor]}>{profileData.mb_name}</Text>
          <Text style={[styles.username, textThemedColor]}>@{profileData.mb_nick}</Text>
          <ScrollView
            style={styles.bioContainer}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
          >
            <Text style={[styles.bio, textThemedColor]}>{profileData.mb_profile}</Text>
          </ScrollView>
          

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
  bioContainer: {
    maxHeight: 100,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 2,
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
    backgroundColor: Colors.btn_blue,
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.btn_text_white,
  }
});

export default ProfileScreen;