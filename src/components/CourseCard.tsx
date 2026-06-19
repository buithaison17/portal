interface CardProps {
    courseName: string;
    totalLesson: string;
    onClick: () => void;
}

const CourseCard = ({ courseName, totalLesson, onClick }: CardProps) => {
    return (
        <div
            onClick={onClick}
            className="overflow-hidden h-95 flex flex-col justify-between rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
            <img
                src="https://portal.rikkei.edu.vn/default.png"
                className="h-44 w-full object-cover"
            />

            <div className="space-y-4 p-5">
                <span className={`rounded-full px-3 py-1 text-sm font-medium `}>
                    Beginner
                </span>

                <h3 className="line-clamp-2 text-lg font-bold text-slate-800">
                    {courseName}
                </h3>

                <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>📚 {totalLesson} bài học</span>
                </div>

                <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
                    Chi tiết
                </button>
            </div>
        </div>
    );
};

export default CourseCard;
