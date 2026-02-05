/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: '#333333', // 你的灰白风格
	},
};

function App() {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
				<PaperProvider theme={theme}>
					<NavigationContainer>
						<RootNavigator />
					</NavigationContainer>
				</PaperProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}

export default App;