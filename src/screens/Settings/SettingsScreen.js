import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Platform, Linking, AppState
} from 'react-native';
import { Notifications } from 'react-native-notifications';
import { useTheme } from '../../context/theme/ThemeContext';

const SettingsScreen = () => {
  const { bgThemedColor, textThemedColor, isDarkMode, toggleTheme } = useTheme();
  const [ isAlarmAllowed, setIsAlarmAllowed ] = useState(false);
  const [ isCheckingPermission, setIsCheckingPermission ] = useState(false);
  const appState = useRef(AppState.currentState);
  const lastCheckTime = useRef(0);
  const checkInterval = 1000;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    Notifications.isRegisteredForRemoteNotifications()
      .then((registered) => {
        setIsAlarmAllowed(registered);
      });

    return () => {
      subscription.remove();
    }
  }, []);

  const handleSettings = () => {
    Linking.openSettings();
  }

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (Platform.OS === 'android') {
        const currentTime = Date.now();
        if (currentTime - lastCheckTime.current > checkInterval && !isCheckingPermission) {
          checkNotificationPermission();
        }
      }
    };
    appState.current = nextAppState;
  };

  const checkNotificationPermission = async () => {
    setIsCheckingPermission(true);
    lastCheckTime.current = Date.now();

    try {
      Notifications.isRegisteredForRemoteNotifications()
      .then((registered) => {
        setIsAlarmAllowed(registered);
      });
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  return (
    <View style={[styles.container, bgThemedColor]}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={toggleTheme}
      >
        <Text style={[styles.text, textThemedColor]}>
          밝기모드
          <Text style={{fontSize: 20}} >{isDarkMode ? ' 🌙' : ' ☀️'}</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={handleSettings}
      >
        <Text style={[styles.text, textThemedColor]}>
          알림설정:
          <Text style={[styles.text, textThemedColor]}>
            {isAlarmAllowed ? '허용' : '거부'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'gray',
    height: 80,
    paddingLeft: 20,
  },
  text: {
    fontSize: 20,
  },
});

export default SettingsScreen;