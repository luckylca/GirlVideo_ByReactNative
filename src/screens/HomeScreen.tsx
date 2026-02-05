import React = require("react");
import { ViewStyle, TextStyle, ImageStyle, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Slide from './component/Slide';
import { useUserStore } from "@/store/useUserStore";
import { useSettingStore } from "@/store/useSettingStore";
import { useVideoStore } from "@/store/useVideoStore";
import getVideo from "@/api/GetVideo";
import { G } from "react-native-svg";
import { get } from "react-native/Libraries/NativeComponent/NativeComponentRegistry";
interface Styles {
  container: ViewStyle; // 容器样式
  card: TextStyle; // 卡片样式
}
const HomeScreen = ({navigation}:any) => {
    const videoStore = useVideoStore();
    const userStore = useUserStore();
    const settingStore = useSettingStore();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    
    const getCurrentIndex = async (index: number) => {
        setCurrentIndex(index);
        if(index >= videoStore.videoList.length - 4){
            const url = userStore.chanelList.find(chanel => chanel.id === settingStore.chanelId)?.url;
            if (!url) {
                return;
            }
            const videoData = await getVideo(url);
            const videoItem = {
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                uri: videoData.data,
                type: 'video',
                description: videoData.title
            };
            videoStore.addVideo(videoItem);
        }
    }

    React.useEffect(() => {
        const preloadVideos = async () => {
            const url = userStore.chanelList.find(chanel => chanel.id === settingStore.chanelId)?.url;
            if (!url) {
                return;
            }
            for (let i = 0; i < 7; i++) {
                const videoData = await getVideo(url);
                const videoItem = {
                    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    uri: videoData.data,
                    type: 'video',
                    description: videoData.title
                };
                videoStore.addVideo(videoItem);
            }
        }
        if(videoStore.videoList.length === 0){
            preloadVideos();
        }
    }, [settingStore.chanelId, userStore.chanelList, videoStore]);

    return (
        <View style={styles.container}>
            <Slide data={videoStore.videoList} dataType="image" onIndexChange={getCurrentIndex}/>
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