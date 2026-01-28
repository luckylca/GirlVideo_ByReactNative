import React = require("react");
import { ViewStyle, TextStyle, ImageStyle, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Slide from './component/Slide';
interface Styles {
  container: ViewStyle; // 容器样式
  card: TextStyle; // 卡片样式
}
const HomeScreen = ({navigation}:any) => {
    const data = [
        { id: '1', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: '2', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: '3', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: '4', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: '5', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: '6', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: '7', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: '8', type: 'image', uri: 'https://picsum.photos/300/200?random=8' },
        { id: '9', type: 'image', uri: 'https://picsum.photos/300/200?random=9' },
        { id: '10', type: 'image', uri: 'https://picsum.photos/300/200?random=10' },
        { id: '11', type: 'image', uri: 'https://picsum.photos/300/200?random=11' },
        { id: '12', type: 'image', uri: 'https://picsum.photos/300/200?random=12' },
        { id: '13', type: 'image', uri: 'https://picsum.photos/300/200?random=13' },
        { id: '14', type: 'image', uri: 'https://picsum.photos/300/200?random=14' },
        { id: '15', type: 'image', uri: 'https://picsum.photos/300/200?random=15' },
        { id: '16', type: 'image', uri: 'https://picsum.photos/300/200?random=16' },
        { id: '17', type: 'image', uri: 'https://picsum.photos/300/200?random=7' },
        { id: '18', type: 'image', uri: 'https://picsum.photos/300/200?random=8' },
        { id: '19', type: 'image', uri: 'https://picsum.photos/300/200?random=9' },
        { id: '20', type: 'image', uri: 'https://picsum.photos/300/200?random=10' },        
    ];

    return (
        <View style={styles.container}>
            <Slide data={data} dataType="image"></Slide>
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