import React from 'react';
import { ViewStyle, StyleSheet, View, Dimensions, Text, TextStyle } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';
import HeartComponent from "./Heart";
const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const NAV_BAR_HEIGHT = 80;
interface Styles {
    layout: ViewStyle;
    rateText: TextStyle;
}

const PauseView = () => {
    return (
        <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            pointerEvents: 'box-none',
        }}>
            <Svg viewBox="0 0 1024 1024" width={100} height={100}>
                <Path d="M512 0C229.227168 0 0 229.227168 0 512s229.227168 512 512 512S1024 794.772832 1024 512 794.772832 0 512 0z m183.134237 556.605165l-234.455205 209.955734c-37.541754 23.428835-84.621894-5.853733-84.621894-52.725307v-419.911468c0-46.85767 47.010618-76.154143 84.621894-52.725308l234.455205 209.955734c37.611276 23.44274 37.611276 82.02178 0 105.450615z" />
            </Svg>
        </View>
    )
}

const RateView = ({ rate }: { rate: number }) => {
    return (
        <Text style={styles.rateText}>正在以{rate}倍速播放x</Text>
    )
}



const VideoLayout = React.memo(({ item, paused, repeat, onended }: { item: any, paused: boolean, repeat: boolean, onended?: () => void }) => {
    const videoRef = React.useRef<VideoRef>(null);
    const [manualPaused, setManualPaused] = React.useState(false);
    const pausedState = paused || manualPaused;
    const [hearts,setHearts] = React.useState<{id:number,x:number,y:number}[]>([]);
    const [rate,setRate] = React.useState(1.0);
    const generationHearts = (x:number,y:number) => {
        const newHeart = { id: Date.now(), x, y };
        setHearts((prevHearts) => [...prevHearts, newHeart]);
    }
    const handleHeartsAnimationEnd = (id:number) => {
        setHearts((prevHearts) => prevHearts.filter(h => h.id !== id));
    }
    const videoEnd = () => {
        videoRef.current?.seek(0);
        onended();
    }
    const singleTap = Gesture.Tap()
        .numberOfTaps(1)
        .onEnd(() => {
            scheduleOnRN(setManualPaused, !manualPaused);
        });
    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((event) => {
            const { x, y } = event;
            scheduleOnRN(generationHearts,x,y)
        });
    const longPress = Gesture.LongPress()
        .onStart(() => {
            scheduleOnRN(setRate, 3.0);
        })
        .onEnd(() => {
            scheduleOnRN(setRate, 1.0);
        });
    return (
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap, longPress)}>
            <View style={[styles.layout, { backgroundColor: '#1a1a1a' }]}>
                <Video
                    source={{ uri: item.uri }}
                    style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT - NAV_BAR_HEIGHT }}
                    resizeMode="contain"
                    paused={pausedState}
                    ref = {videoRef}
                    repeat={repeat}
                    rate={rate}
                    playInBackground={false} // 切后台必须暂停
                    playWhenInactive={false}
                    onEnd={() => {
                        if (!repeat && onended) {
                            videoEnd();
                        }
                    }}
                />
                {hearts.map((heart) => (
                    <HeartComponent
                        key={heart.id}
                        startX={heart.x}
                        startY={heart.y}
                        onAnimationEnd={() => {
                            handleHeartsAnimationEnd(heart.id);
                        }}
                    />
                ))}
                {pausedState && <PauseView />}
                {rate !== 1.0 && <RateView rate={rate} />}
            </View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create<Styles>({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateText: {
        position: 'absolute',
        bottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        fontSize: 16,
        pointerEvents: 'none',
    },
});

export default VideoLayout;