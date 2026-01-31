import {create} from 'zustand';

interface SettingState {
    autoPlay: boolean;
    setAutoPlay: (value: boolean) => void;
    fastForwardRate?: number;
    setFastForwardRate?: (value: number) => void;
}

export const useSettingStore = create<SettingState>((set) => ({
    autoPlay: false,
    setAutoPlay: (value: boolean) => set(() => ({ autoPlay: value })),
    fastForwardRate: 2.0,
    setFastForwardRate: (value: number) => set(() => ({ fastForwardRate: value })),
}));