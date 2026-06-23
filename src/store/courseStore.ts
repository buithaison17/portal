import axios from "axios";
import { create } from "zustand";

interface CourseState {
    studentId: number | null;
    semesters: any[];
    loading: boolean;
    loadCourse: (token: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
    studentId: null,
    semesters: [],
    loading: false,
    loadCourse: async (token: string) => {
        try {
            set({ loading: true });
            const response = await axios.get("/api/student/profile/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let data: any[] = response.data.data.system.specializes[0].semesters
            if (data.length === 0) {
                data = response.data.data.system.specializes[2].semesters
            }

            set({
                semesters: data,
                studentId: response.data.data.id,
            });
            console.log(response.data);
        } catch (error: any) {
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
}));
