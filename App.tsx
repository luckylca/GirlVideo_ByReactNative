import * as React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation'; // 引入刚才写的路由

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      {/* 控制手机顶部状态栏颜色 */}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* 路由容器包裹整个应用 */}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;