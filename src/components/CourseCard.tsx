import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";

interface CardProps {
    courseName: string;
    totalLesson: string;
    onClick: () => void;
}

const CourseCard: React.FC<CardProps> = ({ courseName, totalLesson, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
            {/* Image Container with Zoom effect */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src="https://portal.rikkei.edu.vn/default.png"
                    alt={courseName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-80" />
            </div>

            {/* Content Details */}
            <div className="flex flex-col flex-1 p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        Beginner
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                        Active
                    </span>
                </div>

                <h3 className="line-clamp-2 text-md font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                    {courseName}
                </h3>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-slate-400" />
                        {totalLesson} bài học
                    </span>
                </div>

                <button className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-50 group-hover:bg-blue-600 py-2.5 text-xs font-semibold text-slate-700 group-hover:text-white transition-all duration-300">
                    Chi tiết
                    <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    );
};

export default CourseCard;
