import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import { useCourseDetailStore } from "../store/courseDetailStore";
// import { useLessionStore } from "../store/lessionStore";
import { useProcessVideo } from "../store/videoProcess";

const CourseDetail = () => {
    const loadCourseDetails = useCourseDetailStore(
        (state) => state.loadCourseDetails,
    );

    const courseDetails = useCourseDetailStore((state) => state.courseDetails);
    // const loadLession = useLessionStore((state) => state.loadLession);

    const { id } = useParams();

    const processVideo = useProcessVideo((state) => state.processVideo);

    useEffect(() => {
        if (id) {
            loadCourseDetails(Number(id));
        }
    }, []);

    // Xử lý hoàn thành Sesion
    const handleUnlockSession = async (id: number) => {
        // Session cần unlock
        const session = courseDetails.filter((c) => c.id === id)[0];
        // Tạo danh sách lesson id của session
        const lessonIds = session.lessons.map((lesson: any) => lesson.id);
        // Hoàn thành từng lesson
        for (const id of lessonIds) {
            // const lesson = await loadLession(Number(id));
            // Hoàn thành video
            await processVideo(id);
        }
    };
    return (
        <div className="mx-auto max-w-5xl p-8">
            {/* Banner */}
            <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-lg">
                <div className="h-60 bg-linear-to-r from-blue-500 to-indigo-600" />

                <div className="p-6">
                    <h1 className="text-3xl font-bold">
                        ReactJS Từ Cơ Bản Đến Nâng Cao
                    </h1>

                    <div className="mt-3 flex gap-4 text-slate-500">
                        <span>📚 12 bài học</span>
                        <span>⭐ Beginner</span>
                    </div>
                </div>
            </div>

            {/* Lessons */}
            <div className="space-y-4">
                {courseDetails.map((session) => (
                    <SessionCard
                        key={session.id}
                        title={session.name}
                        success={session.success}
                        onClick={() => handleUnlockSession(session.id)}
                    ></SessionCard>
                ))}
            </div>
        </div>
    );
};

export default CourseDetail;
