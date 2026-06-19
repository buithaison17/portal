import { create } from "zustand";
import { useTokenStore } from "./tokenStore";
import axios from "axios";

interface SessionState {
    sessions: any[];
    loading: boolean;
    loadSessions: (id: number) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessions: [],
    loading: false,
    loadSessions: async (id) => {
        try {
            set({ loading: true });
            const token = useTokenStore.getState().token?.portalToken;
            const response = await axios.get(
                `/api/sessions/student/course/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log(response.data.data);
        } catch (error: any) {
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
}));
