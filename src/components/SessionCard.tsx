import React from "react";
import { CheckCircle2, Lock, Loader2, ArrowRight } from "lucide-react";

interface LessionCardProps {
    title: string;
    success: boolean;
    onClick: () => void;
    loading?: boolean;
}

const SessionCard: React.FC<LessionCardProps> = ({ title, success, onClick, loading = false }) => {
    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl bg-white p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 gap-4 ${success ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-slate-300"}`}>
            <div className="flex items-center gap-3.5">
                {success ? (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={18} />
                    </div>
                ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                        <Lock size={18} />
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">{title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {success ? "Bài học đã hoàn thành" : "Nội dung đang bị khóa"}
                    </p>
                </div>
            </div>

            <div className="self-stretch sm:self-auto flex items-center justify-end">
                {success ? (
                    <button className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer">
                        Đã nộp bài
                        <CheckCircle2 size={14} />
                    </button>
                ) : (
                    <button
                        onClick={loading ? undefined : onClick}
                        disabled={loading}
                        className={`w-full sm:w-auto px-4 py-2 font-semibold text-xs rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer border ${
                            loading
                                ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] border-blue-600 text-white shadow-xs"
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Đang mở...
                            </>
                        ) : (
                            <>
                                Mở khóa
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SessionCard;
