import axios from "axios";
import { create } from "zustand";
import { useTokenStore } from "./tokenStore";

interface HomeworkState {
    homeworkList: any[];
    loading: boolean;
    loadHomeworkList: (sessionId: number) => Promise<any[]>;
    submitHomework: (courseId: string, homeworkId: string, linkGit: string) => Promise<any>;
}

export const useHomeworkStore = create<HomeworkState>((set) => ({
    homeworkList: [],
    loading: false,
    loadHomeworkList: async (sessionId) => {
        try {
            set({ loading: true });
            const token = useTokenStore.getState().token?.portalToken;
            const response = await axios.get(`/api/homework/session/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data?.data || [];
            set({ homeworkList: data });
            return data;
        } catch (error: any) {
            console.error("Lỗi khi tải danh sách bài tập từ API:", error);
            set({ homeworkList: [] });
            return [];
        } finally {
            set({ loading: false });
        }
    },
    submitHomework: async (courseId, homeworkId, linkGit) => {
        try {
            set({ loading: true });
            const token = useTokenStore.getState().token?.portalToken;
            const response = await axios.post(
                "/api/exercise/me",
                {
                    courseId,
                    homeworkId,
                    linkGit,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Lỗi khi nộp bài tập:", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));
