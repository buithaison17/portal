import axios from "axios";
import { create } from "zustand";
import { useTokenStore } from "./tokenStore";

interface SessionState {
    courseDetails: any[];
    loading: boolean;
    loadCourseDetails: (courseId: number) => Promise<void>;
}

export const useCourseDetailStore = create<SessionState>((set) => ({
    courseDetails: [],
    loading: false,
    loadCourseDetails: async (courseId) => {
        // Lấy token
        const token = useTokenStore.getState().token?.portalToken;

        try {
            set({ loading: true });
            const response = await axios.get(
                `/api/sessions/student/course/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log(response.data.data);
            set({ courseDetails: response.data.data });
        } catch (error: any) {
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
}));
