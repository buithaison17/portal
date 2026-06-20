import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useCourseDetailStore } from "../store/courseDetailStore";
import { useHomeworkStore } from "../store/homeworkStore";
import { useTokenStore } from "../store/tokenStore";
import { 
    ArrowLeft, 
    BookOpen, 
    Code, 
    Award, 
    Upload, 
    Folder, 
    CheckCircle2, 
    Loader2, 
    X, 
    FileText,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Clock
} from "lucide-react";
import { message } from "antd";

interface AssignmentItem {
    id: number;
    type: "homework" | "practice" | "lesson";
    title: string;
    description?: string;
    expectedTime?: number;
    details?: string;
}

const SessionAssignments: React.FC = () => {
    const { courseId, sessionId } = useParams();
    
    const loadCourseDetails = useCourseDetailStore((state) => state.loadCourseDetails);
    const courseDetails = useCourseDetailStore((state) => state.courseDetails);
    const loadingDetails = useCourseDetailStore((state) => state.loading);

    // Homework list loaded from store
    const homeworkList = useHomeworkStore((state) => state.homeworkList);
    const loadingHomework = useHomeworkStore((state) => state.loading);
    const loadHomeworkList = useHomeworkStore((state) => state.loadHomeworkList);
    
    const [expandedHwIds, setExpandedHwIds] = useState<number[]>([]);

    // Submission states
    const [submittingAssignment, setSubmittingAssignment] = useState<AssignmentItem | null>(null);
    const [submitName, setSubmitName] = useState("");
    const [selectedFolderFiles, setSelectedFolderFiles] = useState<FileList | null>(null);
    const [folderName, setFolderName] = useState("");
    const [selectMode, setSelectMode] = useState<"files" | "folder">("folder");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("");
    
    // Persistent submission status
    const [submittedIds, setSubmittedIds] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem("submitted_assignment_ids");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const folderInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (courseId && courseDetails.length === 0) {
            loadCourseDetails(Number(courseId));
        }
    }, [courseId, courseDetails, loadCourseDetails]);

    // Fetch homework details using the Zustand store
    useEffect(() => {
        if (sessionId) {
            loadHomeworkList(Number(sessionId));
        }
    }, [sessionId, loadHomeworkList]);

    const session = courseDetails.find((s) => String(s.id) === String(sessionId));

    // Only display homework items returned by the API
    const assignments: AssignmentItem[] = homeworkList.map((hw: any) => ({
        id: hw.id,
        type: "homework",
        title: hw.title,
        description: hw.description,
        expectedTime: hw.expectedTime,
        details: hw.expectedTime ? `Thời gian dự kiến: ${hw.expectedTime} phút` : undefined
    }));

    const handleOpenSubmitModal = (item: AssignmentItem) => {
        setSubmittingAssignment(item);
        setSubmitName("");
        setSelectedFolderFiles(null);
        setFolderName("");
        setSelectMode("folder");
        setUploadProgress(0);
        setUploading(false);
        setUploadStatus("");
    };

    const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = e.target.files;
            setSelectedFolderFiles(files);
            const firstFilePath = files[0].webkitRelativePath || "";
            const extractedFolderName = firstFilePath.split("/")[0] || "Thư mục bài làm";
            setFolderName(extractedFolderName);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = e.target.files;
            setSelectedFolderFiles(files);
            setFolderName(`${files.length} tệp đã chọn`);
        }
    };

    const triggerSelect = () => {
        if (selectMode === "folder") {
            folderInputRef.current?.click();
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleSwitchMode = (mode: "files" | "folder") => {
        if (mode === selectMode) return;
        setSelectMode(mode);
        setSelectedFolderFiles(null);
        setFolderName("");
        // reset input values so same selection can be re-picked
        if (folderInputRef.current) folderInputRef.current.value = "";
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const toggleExpandHw = (id: number) => {
        setExpandedHwIds((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const repoName = submitName.trim();
        if (!repoName) {
            message.error("Vui lòng nhập tên thư mục (tên repo)!");
            return;
        }
        if (!selectedFolderFiles || selectedFolderFiles.length === 0) {
            message.error("Vui lòng chọn thư mục bài làm!");
            return;
        }

        const githubToken = useTokenStore.getState().token?.githubToken;
        if (!githubToken) {
            message.error("Chưa có GitHub token, vui lòng đăng nhập lại!");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadStatus("Đang tạo repository GitHub...");

        try {
            // Step 1: Get GitHub username
            const userRes = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: "application/vnd.github+json",
                },
            });
            if (!userRes.ok) throw new Error("Không thể lấy thông tin GitHub user");
            const userData = await userRes.json();
            const githubUsername = userData.login as string;

            // Step 2: Create repository
            const createRepoRes = await fetch("https://api.github.com/user/repos", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: repoName,
                    private: false,
                    auto_init: false,
                }),
            });
            if (!createRepoRes.ok) {
                const err = await createRepoRes.json();
                throw new Error(err.message || "Không thể tạo repository");
            }
            const repoData = await createRepoRes.json();
            const repoHtmlUrl: string = repoData.html_url;

            setUploadProgress(10);
            setUploadStatus(`Đang tải lên ${selectedFolderFiles.length} tệp...`);

            // Step 3: Upload each file
            const files = Array.from(selectedFolderFiles);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const relativePath = (file as any).webkitRelativePath || file.name;

                const content = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = reader.result as string;
                        // result is data URL: "data:...;base64,XXXX"
                        resolve(result.split(",")[1]);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const uploadRes = await fetch(
                    `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${relativePath}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${githubToken}`,
                            Accept: "application/vnd.github+json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: `Upload ${relativePath}`,
                            content,
                        }),
                    }
                );
                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    console.warn(`Lỗi khi tải ${relativePath}:`, err.message);
                }

                const progress = Math.round(10 + ((i + 1) / files.length) * 80);
                setUploadProgress(progress);
                setUploadStatus(`Đang tải lên tệp ${i + 1}/${files.length}...`);
            }

            // Step 4: Submit homework to portal
            setUploadProgress(95);
            setUploadStatus("Đang nộp bài lên hệ thống...");

            const submitStore = useHomeworkStore.getState();
            await submitStore.submitHomework(
                String(courseId),
                String(submittingAssignment!.id),
                repoHtmlUrl
            );

            setUploadProgress(100);
            setUploadStatus("Hoàn thành!");

            // Mark as submitted
            if (submittingAssignment) {
                const newSubmitted = [...submittedIds, submittingAssignment.id];
                setSubmittedIds(newSubmitted);
                localStorage.setItem("submitted_assignment_ids", JSON.stringify(newSubmitted));
                message.success(`Nộp thành công bài tập: ${submittingAssignment.title}`);
            }

            setTimeout(() => {
                setUploading(false);
                setSubmittingAssignment(null);
                setUploadStatus("");
            }, 800);
        } catch (err: any) {
            console.error(err);
            message.error(err.message || "Có lỗi xảy ra khi nộp bài!");
            setUploading(false);
            setUploadStatus("");
        }
    };

    const getIcon = (type: "homework" | "practice" | "lesson") => {
        switch (type) {
            case "homework":
                return <BookOpen className="text-amber-500" size={20} />;
            case "practice":
                return <Code className="text-blue-500" size={20} />;
            case "lesson":
                return <Award className="text-purple-500" size={20} />;
        }
    };

    const getBadgeStyle = (type: "homework" | "practice" | "lesson") => {
        switch (type) {
            case "homework":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "practice":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "lesson":
                return "bg-purple-50 text-purple-700 border-purple-100";
        }
    };

    const getBadgeLabel = (type: "homework" | "practice" | "lesson") => {
        switch (type) {
            case "homework":
                return "Bài tập về nhà";
            case "practice":
                return "Thực hành";
            case "lesson":
                return "Bài tập Lesson";
        }
    };

    const completedCount = assignments.filter((a) => submittedIds.includes(a.id)).length;
    const progressPercent = assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0;
    const isPageLoading = loadingDetails || loadingHomework;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6">
                
                {/* Back button */}
                <Link
                    to={`/courses/${courseId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition bg-white border border-slate-100 hover:bg-blue-50 px-4 py-2.5 rounded-xl shadow-xs"
                >
                    <ArrowLeft size={14} />
                    Quay lại chi tiết khóa học
                </Link>

                {isPageLoading && homeworkList.length === 0 ? (
                    <div className="space-y-6">
                        <div className="h-44 bg-white border border-slate-100 rounded-3xl animate-pulse" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : !session ? (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-xs">
                        <p className="text-slate-500 font-medium">Không tìm thấy thông tin session bài học.</p>
                        <Link to="/home" className="mt-4 inline-block text-sm font-bold text-blue-600 hover:underline">
                            Quay về trang chủ
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Title Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm">
                            <div className="h-44 md:h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden flex items-end p-6 md:p-8 text-white">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                                <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                                
                                <div className="z-10 space-y-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold tracking-wide border border-white/10">
                                        Bài tập của Session
                                    </span>
                                    <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-snug">
                                        {session.name}
                                    </h1>
                                </div>
                            </div>

                            <div className="p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs md:text-sm text-slate-500 font-medium flex items-center gap-2">
                                        <Sparkles size={16} className="text-amber-500" />
                                        Tiến độ bài tập: {completedCount}/{assignments.length} bài hoàn thành ({progressPercent}%)
                                    </p>
                                </div>
                                <div className="w-full md:w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* List of Assignments */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                                Danh sách bài làm ({assignments.length})
                            </h3>

                            {assignments.length === 0 ? (
                                <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl">
                                    <p className="text-slate-500 text-sm">Session này không có bài tập nào được giao.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {assignments.map((item) => {
                                        const isSubmitted = submittedIds.includes(item.id);
                                        const isExpanded = expandedHwIds.includes(item.id);
                                        return (
                                            <div 
                                                key={item.id} 
                                                className={`flex flex-col rounded-2xl bg-white p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 gap-4 ${
                                                    isSubmitted ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-blue-500"
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                                                    <div className="flex items-start gap-3.5">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                                                            {getIcon(item.type)}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                                                                    {item.title}
                                                                </h4>
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getBadgeStyle(item.type)}`}>
                                                                    {getBadgeLabel(item.type)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 flex-wrap">
                                                                {item.details && (
                                                                    <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                                                                        {item.type === "homework" && <Clock size={12} />}
                                                                        {item.details}
                                                                    </p>
                                                                )}
                                                                {item.description && (
                                                                    <button
                                                                        onClick={() => toggleExpandHw(item.id)}
                                                                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 mt-0.5 cursor-pointer focus:outline-none"
                                                                    >
                                                                        {isExpanded ? (
                                                                            <>
                                                                                Thu gọn đề bài
                                                                                <ChevronUp size={12} />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                Xem chi tiết đề bài
                                                                                <ChevronDown size={12} />
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="self-stretch sm:self-auto flex items-center justify-end gap-2.5">
                                                        {isSubmitted ? (
                                                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-xl">
                                                                <CheckCircle2 size={14} />
                                                                Đã nộp bài
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleOpenSubmitModal(item)}
                                                                className="w-full sm:w-auto px-4.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/10"
                                                            >
                                                                <Upload size={14} />
                                                                Nộp bài tập
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expanded Description */}
                                                {isExpanded && item.description && (
                                                    <div 
                                                        className="mt-2 p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 leading-relaxed overflow-x-auto select-text prose max-w-none shadow-inner"
                                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Submission Modal */}
            {submittingAssignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 md:p-8 shadow-2xl animate-scale-up space-y-6">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div>
                                <h3 className="text-base md:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                                    <Upload size={18} className="text-blue-600" />
                                    Nộp bài tập
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium">
                                    Nộp thư mục bài giải cho {submittingAssignment.title}
                                </p>
                            </div>
                            <button
                                onClick={() => !uploading && setSubmittingAssignment(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
                                disabled={uploading}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Repo Name Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Tên thư mục <span className="text-slate-400 font-medium normal-case">(tên GitHub repo)</span> <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="vd: it212-session3-bai1"
                                    value={submitName}
                                    onChange={(e) => setSubmitName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-slate-800 text-xs transition-all duration-200 font-medium font-mono"
                                    required
                                    disabled={uploading}
                                />
                                <p className="text-[10px] text-slate-400">Chỉ dùng chữ thường, số và dấu gạch ngang. Repo sẽ được tạo tự động trên GitHub.</p>
                            </div>

                            {/* File / Folder Selector */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Bài làm <span className="text-red-500">*</span>
                                    </label>
                                    {/* Mode toggle */}
                                    <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
                                        <button
                                            type="button"
                                            disabled={uploading}
                                            onClick={() => handleSwitchMode("folder")}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all duration-150 ${
                                                selectMode === "folder"
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700"
                                            }`}
                                        >
                                            <Folder size={11} />
                                            Chọn folder
                                        </button>
                                        <button
                                            type="button"
                                            disabled={uploading}
                                            onClick={() => handleSwitchMode("files")}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all duration-150 ${
                                                selectMode === "files"
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700"
                                            }`}
                                        >
                                            <FileText size={11} />
                                            Chọn file
                                        </button>
                                    </div>
                                </div>

                                {/* Hidden inputs */}
                                <input
                                    type="file"
                                    ref={folderInputRef}
                                    className="hidden"
                                    multiple
                                    onChange={handleFolderChange}
                                    disabled={uploading}
                                    {...{ webkitdirectory: "", directory: "" }}
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />

                                {/* Dropzone */}
                                <div
                                    onClick={() => !uploading && triggerSelect()}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition duration-150 flex flex-col items-center justify-center gap-3 ${
                                        selectedFolderFiles
                                            ? "border-blue-500 bg-blue-50/30 hover:bg-blue-50/50"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                                    } ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
                                        selectedFolderFiles ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-400"
                                    }`}>
                                        {selectedFolderFiles
                                            ? (selectMode === "folder" ? <Folder size={24} /> : <FileText size={24} />)
                                            : <Upload size={24} />}
                                    </div>

                                    <div className="space-y-1">
                                        {selectedFolderFiles ? (
                                            <>
                                                <h4 className="font-bold text-slate-800 text-xs">
                                                    {selectMode === "folder" ? (
                                                        <>Đã chọn folder: <span className="text-blue-600">{folderName}</span></>
                                                    ) : (
                                                        <><span className="text-blue-600">{selectedFolderFiles.length} file</span> đã được chọn</>
                                                    )}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1.5 mt-1">
                                                    <FileText size={12} />
                                                    {selectedFolderFiles.length} tệp tin bài làm
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="font-bold text-slate-700 text-xs">
                                                    {selectMode === "folder" ? "Click để chọn thư mục" : "Click để chọn file"}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-semibold">
                                                    {selectMode === "folder"
                                                        ? "Toàn bộ thư mục sẽ được upload lên GitHub"
                                                        : "Có thể chọn nhiều file cùng lúc"}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Upload Progress Bar (when uploading) */}
                            {uploading && (
                                <div className="space-y-2 rounded-xl bg-blue-50/60 border border-blue-100 p-3">
                                    <div className="flex justify-between text-[10px] font-bold text-blue-700">
                                        <span className="flex items-center gap-1.5">
                                            <Loader2 size={11} className="animate-spin" />
                                            {uploadStatus || "Đang xử lý..."}
                                        </span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setSubmittingAssignment(null)}
                                    className="px-4.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition duration-150 cursor-pointer"
                                    disabled={uploading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 ${
                                        uploading ? "opacity-75 cursor-not-allowed" : ""
                                    }`}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Đang nộp...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={14} />
                                            Nộp bài
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionAssignments;
