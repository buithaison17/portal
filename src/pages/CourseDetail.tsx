import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import { useCourseDetailStore } from "../store/courseDetailStore";
import { useCourseStore } from "../store/courseStore";
import { useProcessVideo } from "../store/videoProcess";
import { ArrowLeft, BookOpen, GraduationCap, Award, Sparkles } from "lucide-react";
import { useLessionStore } from "../store/lessionStore";
import { useDocumentStore } from "../store/documentStore";
import { useQuizStore } from "../store/quizStore";
import { message } from "antd";

const CourseDetail: React.FC = () => {
    const { id } = useParams();
    const loadCourseDetails = useCourseDetailStore(
        (state) => state.loadCourseDetails,
    );
    const courseDetails = useCourseDetailStore((state) => state.courseDetails);
    const loadingDetails = useCourseDetailStore((state) => state.loading);
    const processVideo = useProcessVideo((state) => state.processVideo);

    // Retrieve active course info dynamically from CourseStore
    const semesters = useCourseStore((state) => state.semesters);
    const course = semesters
        .flatMap((s) => s.courses || [])
        .find((c: any) => String(c.id) === String(id));

    const courseName = course ? course.name : "Chi tiết khóa học";
    const totalLesson = course ? course.hour : "";

    const loadLession = useLessionStore((state) => state.loadLession);
    const submitDocument = useDocumentStore((state) => state.submitDocument);
    const submitQuiz = useQuizStore((state) => state.submitQuiz);
    const [unlockingSessionId, setUnlockingSessionId] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            loadCourseDetails(Number(id));
        }
    }, [id]);

    // Handle unlocking of Session
    const handleUnlockSession = async (sessionId: number) => {
        setUnlockingSessionId(sessionId);
        try {
            const session = courseDetails.find((c) => c.id === sessionId);
            if (!session) return;

            const lessonIds = session.lessons.map((lesson: any) => lesson.id);
            // Process each lesson video sequentially
            for (const lid of lessonIds) {
                // Hoàn thành video bài học
                await processVideo(lid);
                // Lấy ra các bài đọc và hoàn thành
                const lesson = await loadLession(lid);
                const documentList = lesson.questionDocuments.map((q: any) => {
                    return {
                        questionId: q.id,
                        answer: q.answer
                    }
                })
                // Duyệt bài đọc
                for (const doc of documentList) {
                    await submitDocument(doc);
                }
                // Lấy đáp án đúng
                const correctAns = lesson.assignments[0].questions.map((q: any) => {
                    return {
                        questionId: q.id,
                        answerId: q.answers.find((a: any) => a.isCorrect).id
                    }
                })
                // Submit quizz
                await submitQuiz(0, String(lesson.assignments[0].id), String(lid), correctAns);
            }
            // Reload details to reflect new completion states
            if (id) {
                await loadCourseDetails(Number(id));
                message.success("Mở khoá học thành công")
            }
        } catch (error: any) {
            message.error("Lỗi khi mở khóa session:", error);
        } finally {
            setUnlockingSessionId(null);
        }
    };

    // Calculate completed sessions percentage
    const completedSessions = courseDetails.filter(s => s.success).length;
    const totalSessions = courseDetails.length;
    const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6">

                {/* Back button */}
                <Link
                    to="/home"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition bg-white border border-slate-100 hover:bg-blue-50 px-4 py-2.5 rounded-xl shadow-xs"
                >
                    <ArrowLeft size={14} />
                    Quay lại trang chủ
                </Link>

                {/* Banner Hero Card */}
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm">
                    {/* Background Pattern and Gradient */}
                    <div className="h-48 md:h-56 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden flex items-end p-6 md:p-8 text-white">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />

                        <div className="z-10 space-y-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold tracking-wide border border-white/10">
                                <GraduationCap size={12} />
                                Khóa học
                            </span>
                            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight leading-snug">
                                {courseName}
                            </h1>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-wrap gap-4 text-xs md:text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <BookOpen size={16} className="text-slate-400" />
                                {totalLesson ? `${totalLesson} bài học` : `${totalSessions} Sessions`}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Award size={16} className="text-slate-400" />
                                Beginner
                            </span>
                            <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                                <Sparkles size={16} className="text-amber-500 animate-pulse" />
                                Tiến độ: {progressPercent}% ({completedSessions}/{totalSessions})
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Lessons Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider pl-1">
                        Danh sách bài học / Sessions
                    </h3>

                    {loadingDetails ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-white border border-slate-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : courseDetails.length === 0 ? (
                        <div className="text-center py-10 bg-white border border-slate-100 rounded-2xl">
                            <p className="text-slate-500 text-sm">Chưa có bài học nào được tải cho khóa học này.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {courseDetails.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    title={session.name}
                                    success={session.success}
                                    loading={unlockingSessionId === session.id}
                                    onClick={() => handleUnlockSession(session.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CourseDetail;
