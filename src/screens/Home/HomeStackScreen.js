import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import WriteScreen from '../Board/Write/WriteScreen';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen 
        name="Write"
        component={WriteScreen}
        options={({ route }) => ({ title: route.params.bo_table })}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;