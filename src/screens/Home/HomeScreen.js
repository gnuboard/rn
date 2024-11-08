import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, Alert, Platform,
  SafeAreaView, TouchableOpacity, PermissionsAndroid
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import Latest from '../../components/Home/Latest';
import LatestGallery from '../../components/Home/LatestGallery';
import { useTheme } from '../../context/theme/ThemeContext';
import { useBoards } from '../../context/boards/BoardsContext';
import { apiConfig } from '../../services/api/config/ServerApiConfig';
import { requestStoragePermission } from '../../utils/os/android/permission';
import { fetchBoardConfigRequest } from '../../services/api/ServerApi';
import { Styles } from '../../styles/styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { bgThemedColor, getThemedTextColor, textThemedColor } = useTheme();
  const { setBoardsConfig } = useBoards();


  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  useEffect(() => {
    // 저장공간에 대한 권한을 요청합니다.
    requestStoragePermission();

    // 알람에 대한 권한을 요청합니다.
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      // 안드로이드 13 이상의 버전에서만 알람 설정 권한을 요청합니다.
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    //  메시지가 전송되었을 때, 백그라운드에서 처리할 로직을 작성할 수 있습니다.
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background handling', remoteMessage);
    });

    // 앱이 백그라운드에서 실행 중일 때, push 알림을 클릭하여 앱을 열었을 때 실행되는 로직을 작성할 수 있습니다.
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Opening handling from background state', remoteMessage.notification);
      handleMessage(remoteMessage);
    });

    // 앱이 종료된 상태에서 push 알림을 클릭하여 앱을 열었을 때 실행되는 로직을 작성할 수 있습니다.
    messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opening handling from quit state', remoteMessage.notification,);
          navigation.navigate('Profile');
        }
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: () => handleMessage(remoteMessage),
          }
        ]
      );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchBoardsConfig();
  }, []);

  const fetchBoardsConfig = async () => {
    const  [ freeConfig, galleryConfig, noticeConfig, qaConfig ] = await Promise.all([
      fetchBoardConfigRequest('free'),
      fetchBoardConfigRequest('gallery'),
      fetchBoardConfigRequest('notice'),
      fetchBoardConfigRequest('qa'),
    ]);

    setBoardsConfig({
      free: freeConfig.data,
      gallery: galleryConfig.data,
      notice: noticeConfig.data,
      qa: qaConfig.data,
    });
  }

  const handleMessage = (remoteMessage) => {
    if (remoteMessage.data.alarm_type === 'comment') {
      const {bo_table, wr_id, comment_id, order} = remoteMessage.data;
      const commentPage = Math.ceil(order / apiConfig.commentsPerPage);
      navigation.navigate(
        'Boards',
        {
          screen: 'Write',
          params: {bo_table, wr_id, comment_id, commentPage},
          initial: false,
        }
      );
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, bgThemedColor]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Icon name="menu" size={24} color={getThemedTextColor()} />
        </TouchableOpacity>
        <Text style={[styles.title, textThemedColor]}>그누보드</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.column}
              onPress={() => navigation.navigate(
                'Boards',
                {
                  screen: 'WriteList',
                  params: { bo_table: 'free' },
                  initial: false,
                }
              )}
              activeOpacity={1}
            >
              <Latest title="자유게시판" bo_table="free" rows={5}/>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.column}
              onPress={() => navigation.navigate(
                'Boards',
                {
                  screen: 'WriteList',
                  params: { bo_table: 'notice' },
                  initial: false,
                }
              )}
              activeOpacity={1}
            >
              <Latest title="공지사항" bo_table="notice" rows={5}/>
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <LatestGallery bo_table="gallery" view_type="write" rows={4} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = new Styles.HomeScreen();

export default HomeScreen;