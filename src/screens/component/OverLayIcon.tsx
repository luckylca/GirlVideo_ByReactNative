import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Svg, { Rect, Path,Circle } from "react-native-svg";

type BubbleProps = {
    size?: number;
    /** 圆形底色（建议直接传 rgba，包含透明度） */
    backgroundColor?: string;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
};

type CommonProps = {
    size?: number;
};

function IconBubble({
    size = 96,
    backgroundColor = "rgba(0,0,0,0.40)",
    style,
    children,
}: BubbleProps) {
    return (
        <View
            style={[
                styles.bubble,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

export function PauseOverlayIcon({
    size = 96,
    bubbleColor = "rgba(0,0,0,0.40)",
    iconColor = "#fff",
    style,
}: {
    size?: number;
    bubbleColor?: string;
    iconColor?: string;
    style?: StyleProp<ViewStyle>;
}) {
    return (
        <IconBubble size={size} backgroundColor={bubbleColor} style={style}>
            <Svg width={size} height={size} viewBox="0 0 24 24">
                <Rect x="8.2" y="7.3" width="2.8" height="9.4" rx="1.2" fill={iconColor} />
                <Rect x="13.0" y="7.3" width="2.8" height="9.4" rx="1.2" fill={iconColor} />
            </Svg>
        </IconBubble>
    );
}

export function HeartOverlayIcon({
    size = 96,
    iconColor = "#FF2D55", // ✅ 默认红色爱心
}: CommonProps & { iconColor?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
                fill={iconColor}
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
        </Svg>
    );
}

const styles = StyleSheet.create({
    bubble: {
        alignItems: "center",
        justifyContent: "center",
        // iOS 阴影
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        // Android 阴影
        elevation: 6,
        // overflow: "hidden", // 圆形裁切更干净
    },
});
