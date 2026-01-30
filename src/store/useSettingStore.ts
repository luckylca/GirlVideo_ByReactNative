import {creat} from 'zustand';

interface SettingState {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const useSettingStore = creat<SettingState>((set) => ({
    darkMode: false,
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));