// src/store/useVideoStore.ts
// 这里面放的是视频相关的信息，比如视频列表等


import { create } from 'zustand';

interface VideoState {
    videoList: Array<{ id: string; uri: string; type: string;description?: string;cover?:string }>;
    addVideo: (video: { id: string; uri: string; type: string;description?: string;cover?:string }) => void;
    removeVideo: (id: string) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
    videoList: [],
    addVideo: (video) => set((state) => ({ videoList: [...state.videoList, video] })),
    removeVideo: (id) => set((state) => ({ videoList: state.videoList.filter(video => video.id !== id) })),
}));