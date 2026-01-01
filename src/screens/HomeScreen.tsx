import React = require("react");
import { ViewStyle, TextStyle, ImageStyle, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface Styles {
  container: ViewStyle; // 容器样式
  card: TextStyle; // 卡片样式
}
const HomeScreen = ({navigation}:any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.card}>Home Screen</Text>
            <Button mode="contained" onPress={() => navigation.navigate('Settings')}>
                Go to Details
            </Button>
            <Text>Welcome to the Home Screen!</Text>
        </View>
    );
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
    },
    card: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        margin: 16,
    },
});  
export default HomeScreen;