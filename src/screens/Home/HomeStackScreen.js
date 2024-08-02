import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import WriteScreen from '../Board/Write/WriteScreen';
import WriteListScreen from '../Board/Write/WriteListScreen';

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
        name="WriteList"
        component={WriteListScreen}
        options={({ route }) => ({ title: route.params.bo_table })}
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