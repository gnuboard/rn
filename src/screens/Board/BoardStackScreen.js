import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BoardListScreen from './BoardScreen';
import WriteScreen from '../Board/Write/WriteScreen';
import WriteListScreen from '../Board/Write/WriteListScreen';
import WriteUpdateScreen from './Write/WriteUpdateScreen';
import { HeaderBackwardArrow } from '../../components/Common/Arrow';

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
        options={({ route, navigation }) => ({ 
          title: route.params.bo_table,
          headerTitleAlign: 'center',
          headerLeft: () => <HeaderBackwardArrow navigation={navigation} />
        })}
      />
      <BoardStack.Screen
        name="Write"
        component={WriteScreen}
        options={({ route, navigation }) => ({ 
          title: route.params.bo_table,
          headerTitleAlign: 'center',
          headerLeft: () => <HeaderBackwardArrow navigation={navigation} />
        })}
      />
      <BoardStack.Screen
        name="WriteUpdate"
        component={WriteUpdateScreen}
        options={({ route, navigation }) => ({ 
          title: route.params.bo_table,
          headerTitleAlign: 'center',
          headerLeft: () => <HeaderBackwardArrow navigation={navigation} />
        })}
      />
    </BoardStack.Navigator>
  );
}

export default BoardStackScreen;