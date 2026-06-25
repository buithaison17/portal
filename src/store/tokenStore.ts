import { create } from "zustand";

export interface TokenType {
    portalToken: string;
    githubToken: string;
}

interface TokenState {
    token: TokenType | null;
    loading: boolean;
    setToken: (token: TokenType) => void;
}

export const useTokenStore = create<TokenState>((set) => ({
    token: JSON.parse(localStorage.getItem("token") || "null"),
    loading: false,
    setToken: (token) => {
        set({ token });
    },
}));
