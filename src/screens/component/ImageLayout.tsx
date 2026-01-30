import React from 'react';
import { ViewStyle, StyleSheet, View, Dimensions, Image } from 'react-native';

const ImageLayout = React.memo(({ item }: { item: any }) => {
    const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
    return (
        <View style={[styles.layout, { backgroundColor: '#333' }]}>
            {/* 这里写图片的界面 */}
            <Image source={{ uri: item.uri }} style={{ width: WINDOW_WIDTH, height: '100%' }} resizeMode="contain" />
        </View>
    );
});

const styles = StyleSheet.create<{
    layout: ViewStyle;
}>({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ImageLayout;