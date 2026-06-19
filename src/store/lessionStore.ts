import axios from "axios";
import { create } from "zustand";
import { useTokenStore } from "./tokenStore";

interface LessionState {
    lession: any;
    loading: boolean;
    loadLession: (id: number) => Promise<any>;
}

export const useLessionStore = create<LessionState>((set) => ({
    lession: null,
    loading: false,
    loadLession: async (id) => {
        try {
            set({ loading: true });
            const token = useTokenStore.getState().token?.portalToken;
            const response = await axios.get(`/api/lessons/student/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ lession: response.data });
            return response.data;
        } catch (error: any) {
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
}));
