import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeStackScreen from '../screens/Home/HomeStackScreen';
import BoardListScreen from '../screens/Board/BoardScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import LoginScreen from '../screens/Auth/Login/LoginScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Boards':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          {
            display: 'flex'
          },
          null
        ],
        // tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: "메인화면" }} />
      <Tab.Screen name="Boards" component={BoardListScreen} options={{ tabBarLabel: "게시판" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "프로필" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: "환경설정" }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="홈" component={TabNavigator} options={{headerShown: false}} />
        <Drawer.Screen name="로그인" component={LoginScreen} options={{headerShown: false}} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;