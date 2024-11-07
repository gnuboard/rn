import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/auth/AuthContext';
import HomeScreen from '../screens/Home/HomeScreen';
import BoardStackScreen from '../screens/Board/BoardStackScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import LoginScreen from '../screens/Auth/Login/LoginScreen';
import SignupScreen from '../screens/Auth/Signup/SignupScreen';
import ProfileUpdateScreen from '../screens/Profile/ProfileUpdateScreen';
import ZipScreen from '../screens/Zip/ZipScreen';
import { logoutGetter, isLoggedInGetter } from '../services/api/ServerApi'
import { navigationRef } from './RootNavigation';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{headerShown: false}} />
      <Stack.Screen name="ProfileUpdate" component={ProfileUpdateScreen} options={{headerShown: false}} />
      <Stack.Screen name="Zip" component={ZipScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "메인화면" }} />
      <Tab.Screen
        name="Boards"
        component={BoardStackScreen}
        options={{ tabBarLabel: "게시판", unmountOnBlur: true }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate(
              'Boards',
              {screen: 'BoardListScreen'},
            );
          }
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "프로필" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: "환경설정" }} />
    </Tab.Navigator>
  );
};

const handleLogout = (logout) => {
  Alert.alert(
    "Logout",
    "로그아웃 하시겠습니까?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { 
        text: "OK", 
        onPress: () => {
          logout();
        }
      }
    ]
  );
};

const AppNavigator = () => {
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    logoutGetter(logout);
    isLoggedInGetter(isLoggedIn);
  }, [logout, isLoggedIn]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator
        screenOptions={{
          drawerItemStyle: {
            height: 48,
            alignContent: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Stack.Screen name="홈" component={MainStack} options={{headerShown: false}} />
        {isLoggedIn
          ? <Drawer.Screen
              name="로그아웃"
              component={LoginScreen}
              options={{onPress: handleLogout}}
              listeners={() => ({
                drawerItemPress: (e) => {
                  e.preventDefault();
                  handleLogout((logout));
                }
              })}
            />
          : (
            <>
              <Drawer.Screen name="로그인" component={LoginScreen} options={{headerShown: false}} />
              <Drawer.Screen name="회원가입" component={SignupScreen} options={{headerShown: false}} />
            </>
          )
        }
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;