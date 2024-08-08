import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BoardListScreen from './BoardScreen';
import WriteScreen from '../Board/Write/WriteScreen';
import WriteListScreen from '../Board/Write/WriteListScreen';

const BoardStack = createStackNavigator();

const BoardStackScreen = () => {
  return (
    <BoardStack.Navigator>
      <BoardStack.Screen
        name="BoardListScreen"
        component={BoardListScreen}
        options={{ headerShown: false }}
      />
      <BoardStack.Screen
        name="WriteList"
        component={WriteListScreen}
        options={({ route }) => ({ title: route.params.bo_table })}
      />
      <BoardStack.Screen
        name="Write"
        component={WriteScreen}
        options={({ route }) => ({ title: route.params.bo_table })}
      />
    </BoardStack.Navigator>
  );
}

export default BoardStackScreen;