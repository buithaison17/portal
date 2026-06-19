interface LessionCardProps {
    title: string;
    success: boolean;
    onClick: () => void;
}

const SessionCard = ({ title, success, onClick }: LessionCardProps) => {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow">
            <div>
                <h3 className="font-semibold">{title}</h3>
            </div>

            {success ? (
                <button className="rounded-xl bg-blue-600 px-4 py-2 text-white">
                    Nộp bài
                </button>
            ) : (
                <button
                    onClick={onClick}
                    className="rounded-lg bg-red-100 px-3 py-2 text-red-600"
                >
                    🔒 Mở khoá
                </button>
            )}
        </div>
    );
};

export default SessionCard;
