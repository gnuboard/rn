import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity, PermissionsAndroid
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import Latest from '../../components/Home/Latest';
import LatestGallery from '../../components/Home/LatestGallery';
import { Colors } from '../../constants/theme';

const HomeScreen = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  useEffect(() => {
    // 알람에 대한 권한을 요청합니다.
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    //  메시지가 전송되었을 때, 백그라운드에서 처리할 로직을 작성할 수 있습니다.
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background handling', remoteMessage);
    });

    // 앱이 백그라운드에서 실행 중일 때, push 알림을 클릭하여 앱을 열었을 때 실행되는 로직을 작성할 수 있습니다.
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Opening handling from background state', remoteMessage.notification);
      navigation.navigate('Boards');
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
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

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
              <Latest title="자유게시판" bo_table="free" rows={2}/>
            </TouchableOpacity>
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
              <Latest title="공지사항" bo_table="notice" rows={2}/>
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
    color: Colors.text_black,
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