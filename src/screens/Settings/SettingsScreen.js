import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Platform, PermissionsAndroid, Linking, AppState
} from 'react-native';
import ThemedComponent, { useTheme } from '../../context/theme/ThemeContext';

const SettingsScreen = () => {
  const { bgThemedColor, textThemedColor } = useTheme();
  const [ isAlarmAllowed, setIsAlarmAllowed ] = useState(false);
  const [ isCheckingPermission, setIsCheckingPermission ] = useState(false);
  const appState = useRef(AppState.currentState);
  const lastCheckTime = useRef(0);
  const checkInterval = 1000;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
      .then(result => {
        if (result === 'granted') {
          setIsAlarmAllowed(true);
        } else {
          setIsAlarmAllowed(false);
        }
      });
    }

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
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (result === 'granted') {
        setIsAlarmAllowed(true);
      } else {
        setIsAlarmAllowed(false);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  return (
    <View style={[styles.container, bgThemedColor]}>
      <View style={styles.itemContainer}>
        <ThemedComponent />
      </View>
      <View style={styles.container}>
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
    height: 100,
    paddingLeft: 20,
  },
  text: {
    fontSize: 24,
  },
});

export default SettingsScreen;