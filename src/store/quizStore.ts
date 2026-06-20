import { create } from "zustand";
import { useTokenStore } from "./tokenStore";
import axios from "axios";

interface QuizState {
    submitQuiz: (totalPoint: number, assignmentId: string, lessonId: string, answers: any[]) => Promise<void>;
}

export const useQuizStore = create<QuizState>((_set) => ({
    submitQuiz: async (totalPoint: number, assignmentId: string, lessonId: string, answers: any[]) => {
        try {
            const token = useTokenStore.getState().token?.portalToken;
            const response = await axios.post("/api/grades", {
                totalPoint,
                assignmentId,
                lessonId,
                answers,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.log(error);
        }
    },
}));