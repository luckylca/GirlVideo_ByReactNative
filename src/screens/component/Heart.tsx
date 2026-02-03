// HeartComponent.js
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // 假设你安装了react-native-vector-icons
import { HeartOverlayIcon } from './OverLayIcon';

const HeartComponent = ({ startX, startY, onAnimationEnd }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current; // 初始大小为0
    const opacityAnim = useRef(new Animated.Value(1)).current; // 初始不透明度为1
    const randomAngle = Math.random() * 30 - 30; // 随机旋转角度，范围-15到15度
    useEffect(() => {
        // 动画序列：同时执行放大和淡出
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 2, // 放大到原始尺寸（或你希望的倍数）
                duration: 1000, // 动画时长
                easing: Easing.out(Easing.ease), // 缓动函数
                useNativeDriver: true, // 使用原生驱动，性能更好
            }),
            Animated.timing(opacityAnim, {
                toValue: 0, // 逐渐淡出
                duration: 1000, // 动画时长与放大一致
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            // 动画结束后回调，通知父组件可以移除该爱心
            onAnimationEnd();
        });
    }, [scaleAnim, opacityAnim, onAnimationEnd]);

    const heartStyle: any = {
        position: 'absolute' as const,
        left: startX - (styles.heart.width / 2), // 居中爱心
        top: startY - (styles.heart.height / 2), // 居中爱心
        transform: [{ scale: scaleAnim }], // 应用放大动画和旋转动画
        opacity: opacityAnim, // 应用淡出动画
        pointerEvents: 'none' as const, // 让爱心不阻挡触摸事件
    };

    const rotate = Math.random() * 30 - 15; // 随机旋转角度，范围-15到15度
    heartStyle.transform.push({ rotate: `${rotate}deg` });

    return (
        <Animated.View style={heartStyle}>
            {/* <Icon name="heart" size={styles.heart.width} color="red" /> */}
            <HeartOverlayIcon size={styles.heart.width} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    heart: {
        width: 60, // 爱心初始大小
        height: 60,
    },
});

export default HeartComponent;