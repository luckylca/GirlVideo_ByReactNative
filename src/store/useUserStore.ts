// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
    username: string;
    password?: string;
    isLoggedIn: boolean;
    login: (name: string, pass: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    username: '',
    password: '',
    isLoggedIn: false,
    login: (name: string, pass: string) => set({ username: name, password: pass, isLoggedIn: true }),
}));