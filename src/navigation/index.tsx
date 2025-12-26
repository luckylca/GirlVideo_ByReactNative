import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
// 假设你还创建了一个 DetailsScreen
// import DetailsScreen from '../screens/DetailsScreen';

// 1. 定义路由参数列表（TS 的精髓）
export type RootStackParamList = {
    Home: undefined;      // Home 页面不需要参数
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: '首页' }}
            />
            {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        </Stack.Navigator>
    );
};