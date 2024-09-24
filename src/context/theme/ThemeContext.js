import React, { useState, useContext, createContext, useEffect } from 'react';
import { Colors } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }

  const toggleTheme = async () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    await AsyncStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  const getThemedBackgroundColor = () => {
    return isDarkMode ? Colors.dark_mode_background : Colors.light_mode_background;
  };

  const getThemedTextColor = () => {
    return isDarkMode ? Colors.dark_mode_text : Colors.light_mode_text;
  }

  const bgThemedColor = {backgroundColor: getThemedBackgroundColor()};
  const textThemedColor = {color: getThemedTextColor()};

  const contextValue = {
    isDarkMode,
    toggleTheme,
    getThemedBackgroundColor,
    getThemedTextColor,
    bgThemedColor,
    textThemedColor,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);