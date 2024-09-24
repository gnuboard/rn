import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Platform, PermissionsAndroid, Linking
} from 'react-native';
import ThemedComponent, { useTheme } from '../../context/theme/ThemeContext';

const SettingsScreen = () => {
  const { bgThemedColor, textThemedColor } = useTheme();
  const [ isAlarmAllowed, setIsAlarmAllowed ] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleSettings = () => {
    Linking.openSettings();
  }

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