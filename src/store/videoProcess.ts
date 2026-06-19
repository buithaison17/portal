import { create } from "zustand";
import { useCourseStore } from "./courseStore";
import axios from "axios";
import { useTokenStore } from "./tokenStore";

export interface VideoProcessType {
    lessonId: number;
    studentId: number | null;
    process: number;
    status: boolean;
}

interface VideoProcessState {
    loading: boolean;
    processVideo: (lessonId: number) => Promise<void>;
}

export const useProcessVideo = create<VideoProcessState>((set) => ({
    loading: false,
    processVideo: async (lessonId) => {
        try {
            set({ loading: true });
            const token = useTokenStore.getState().token?.portalToken;
            const response = await axios.post(
                "/api/process-video",
                {
                    lessonId: lessonId,
                    studentId: useCourseStore.getState().studentId,
                    process: 95,
                    status: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log(response.data);
        } catch (error: any) {
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
}));
