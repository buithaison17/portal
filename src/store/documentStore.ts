import axios from "axios";
import { create } from "zustand";
import { useTokenStore } from "./tokenStore";

interface DocumentState {
    document: any;
    loading: boolean;
    submitDocument: (payload: any) => Promise<any>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
    document: null,
    loading: false,
    submitDocument: async (payload) => {
        try {
            set({ loading: true });
            const token = useTokenStore.getState().token?.portalToken;
            const response = await axios.post("/api/answer-question-document", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ document: response.data });
            return response.data;
        } catch (error: any) {
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
}));