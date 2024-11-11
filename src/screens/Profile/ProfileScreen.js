import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView,
  SafeAreaView, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeQuotes, adaptLineBreaks } from '../../utils/stringFunc';
import { useAuth } from '../../context/auth/AuthContext';
import { useTheme } from '../../context/theme/ThemeContext';
import { Styles } from '../../styles/styles';
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

const styles = new Styles.ProfileScreen();

export default ProfileScreen;