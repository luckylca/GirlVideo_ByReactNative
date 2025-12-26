// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
    username: string;
    isLoggedIn: boolean;
    login: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    username: '',
    isLoggedIn: false,
    login: (name) => set({ username: name, isLoggedIn: true }),
}));