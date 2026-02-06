// src/store/useVideoStore.ts
// 这里面放的是视频相关的信息，比如视频列表等


import { create } from 'zustand';

interface VideoState {
    currentVideoList: Array<{ id: string; uri: string; type: string;description?: string;cover?:string }>;
    addVideo: (video: { id: string; uri: string; type: string;description?: string;cover?:string }) => void;
    removeVideo: (id: string) => void;

    channelVideoList?: Record<string, Array<{ id: string; uri: string; type: string;description?: string;cover?:string }>>;
    setChannelVideoList?: (channelId: string, videos: Array<{ id: string; uri: string; type: string;description?: string;cover?:string }>) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
    currentVideoList: [],
    addVideo: (video) => set((state) => ({ currentVideoList: [...state.currentVideoList, video] })),
    removeVideo: (id) => set((state) => ({ currentVideoList: state.currentVideoList.filter(video => video.id !== id) })),
    channelVideoList: {},
    setChannelVideoList: (channelId, videos) => set((state) => ({
        channelVideoList: {
            ...state.channelVideoList,
            [channelId]: videos
        }
    })),
}));