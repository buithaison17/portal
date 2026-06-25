import React, { useState, useEffect, type FormEvent } from "react";
import CourseCard from "../components/CourseCard";
import Header from "../components/Header";
import { useCourseStore } from "../store/courseStore";
import { useNavigate } from "react-router-dom";
import { useTokenStore, type TokenType } from "../store/tokenStore";
import { Key, Loader2, Sparkles, GraduationCap, Settings2, HelpCircle, Eye, EyeOff, LayoutGrid } from "lucide-react";

const Home: React.FC = () => {
    const loadCourse = useCourseStore((state) => state.loadCourse);
    const semester = useCourseStore((state) => state.semesters);
    const studentId = useCourseStore((state) => state.studentId);
    const loading = useCourseStore((state) => state.loading);
    const setToken = useTokenStore((state) => state.setToken);
    const savedToken = useTokenStore((state) => state.token);
    const navigate = useNavigate();

    const [input, setInput] = useState<TokenType>({
        portalToken: "",
        githubToken: "",
    });

    const [showConfig, setShowConfig] = useState(false);
    const [showPortalToken, setShowPortalToken] = useState(false);
    const [showGithubToken, setShowGithubToken] = useState(false);

    useEffect(() => {
        if (savedToken) {
            setInput({
                portalToken: savedToken.portalToken || "",
                githubToken: savedToken.githubToken || "",
            });
            // Auto load courses on initial render if saved token is present and semesters empty
            if (savedToken.portalToken && semester.length === 0) {
                loadCourse(savedToken.portalToken);
            }
        }
    }, [savedToken]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setToken({
            portalToken: input.portalToken,
            githubToken: input.githubToken,
        });
        // Save to local storage
        localStorage.setItem("token", JSON.stringify(input));
        await loadCourse(input.portalToken);
        setShowConfig(false);
    };

    const hasCourses = semester.length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">

                {/* Greeting / Configuration Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                                Chào mừng quay trở lại!
                            </h2>
                            <Sparkles size={18} className="text-amber-500 animate-pulse" />
                        </div>
                        <p className="text-slate-500 text-xs md:text-sm mt-1">
                            {studentId
                                ? `Mã số sinh viên: #${studentId} • Truy cập lộ trình và bài học của bạn bên dưới.`
                                : "Nhập thông tin xác thực để bắt đầu học tập và làm bài tập."
                            }
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {hasCourses && (
                            <button
                                onClick={() => setShowConfig(!showConfig)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${showConfig
                                    ? "bg-slate-100 border-slate-200 text-slate-700"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <Settings2 size={14} />
                                {showConfig ? "Đóng cài đặt" : "Cấu hình Token"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Token Configuration Card Panel */}
                {(showConfig || !hasCourses) && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs max-w-2xl mx-auto w-full animate-fade-in space-y-6">
                        <div className="border-b border-slate-50 pb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Settings2 size={18} className="text-blue-600" />
                                Cấu hình mã xác thực API
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Mã Token sẽ được lưu trữ trong phiên làm việc hiện tại để truy xuất dữ liệu khóa học.
                            </p>
                        </div>

                        <form onSubmit={submitForm} className="space-y-4">
                            {/* Portal Token Field */}
                            <div className="space-y-1">
                                <label htmlFor="portalToken" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                                    Portal Token
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                                        <Key size={16} />
                                    </span>
                                    <input
                                        type={showPortalToken ? "text" : "password"}
                                        id="portalToken"
                                        name="portalToken"
                                        placeholder="Nhập Bearer Token từ Rikkei Portal"
                                        value={input.portalToken}
                                        onChange={handleInput}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none text-slate-800 text-xs transition-all duration-200"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPortalToken(!showPortalToken)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                                    >
                                        {showPortalToken ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Github Token Field */}
                            <div className="space-y-1">
                                <label htmlFor="githubToken" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                                    Github Token
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                                        {/* <Github size={16} /> */}
                                    </span>
                                    <input
                                        type={showGithubToken ? "text" : "password"}
                                        id="githubToken"
                                        name="githubToken"
                                        placeholder="Nhập GitHub Personal Access Token"
                                        value={input.githubToken}
                                        onChange={handleInput}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none text-slate-800 text-xs transition-all duration-200"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowGithubToken(!showGithubToken)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                                    >
                                        {showGithubToken ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Button submit */}
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 ${loading ? "opacity-80 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Đang đồng bộ...
                                        </>
                                    ) : (
                                        "Đồng bộ khóa học"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Skeletons/Loading Area */}
                {loading && (
                    <div className="space-y-6">
                        <div className="h-6 w-48 bg-slate-200 rounded-md animate-pulse" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-80 bg-white border border-slate-100 rounded-2xl p-5 space-y-4 animate-pulse">
                                    <div className="h-40 w-full bg-slate-100 rounded-xl" />
                                    <div className="h-4 w-1/3 bg-slate-100 rounded" />
                                    <div className="h-5 w-5/6 bg-slate-100 rounded" />
                                    <div className="h-4 w-2/3 bg-slate-100 rounded mt-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Course List Categorized by Semester */}
                {!loading && hasCourses && (
                    <div className="space-y-10">
                        {semester.map((s: any, idx: number) => (
                            <div key={s.id || s.name || idx} className="space-y-4">
                                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <GraduationCap size={16} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {s.name || `Học kỳ ${idx + 1}`}
                                    </h3>
                                    <span className="text-xs text-slate-400 font-medium">
                                        ({s.courses?.length || 0} khóa học)
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {s.courses?.map((c: any) => (
                                        <CourseCard
                                            key={c.id}
                                            courseName={c.name}
                                            totalLesson={c.hour}
                                            onClick={() => {
                                                navigate(`/courses/${c.id}`);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State when no courses loaded & not loading */}
                {!loading && !hasCourses && (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-100 rounded-3xl shadow-xs min-h-[350px]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
                            <LayoutGrid size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có khóa học nào</h3>
                        <p className="text-slate-500 text-xs md:text-sm max-w-md mb-6 leading-relaxed">
                            Cấu hình Portal Token của bạn ở khung phía trên để đồng bộ danh sách lớp học và bắt đầu bài tập.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <HelpCircle size={14} />
                            <span>Token có thể tìm thấy trong devtools Network của Rikkei Portal</span>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Home;
