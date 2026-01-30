import { create } from 'zustand';

interface VideoState {
    videoList: Array<{ id: string; uri: string; type: string }>;
    addVideo: (video: { id: string; uri: string; type: string }) => void;
    removeVideo: (id: string) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
    videoList: [],
    addVideo: (video) => set((state) => ({ videoList: [...state.videoList, video] })),
    removeVideo: (id) => set((state) => ({ videoList: state.videoList.filter(video => video.id !== id) })),
}));