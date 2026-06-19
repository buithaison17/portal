import { Bell, BookOpen, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <Link to="/home" className="flex items-center gap-3 hover:opacity-90 transition">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <BookOpen size={22} />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-slate-800">
                            EduLearn
                        </h1>
                        <p className="text-xs text-slate-500">
                            Learn Every Day
                        </p>
                    </div>
                </Link>

                {/* Menu Desktop */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        to="/home"
                        className="font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        Trang chủ
                    </Link>

                    <a
                        href="#"
                        className="font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        Khóa học
                    </a>

                    <a
                        href="#"
                        className="font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        Cài đặt
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button className="hidden rounded-xl p-2 transition hover:bg-slate-100 md:block">
                        <Bell size={20} />
                    </button>

                    <Link to="/login" className="hidden rounded-xl border border-slate-200 px-4 py-2 font-medium transition hover:bg-slate-50 md:block text-slate-700 text-center select-none cursor-pointer">
                        Đăng nhập
                    </Link>

                    <Link to="/register" className="hidden rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 md:block text-center select-none cursor-pointer">
                        Đăng ký
                    </Link>

                    {/* Mobile Menu */}
                    <button className="rounded-xl p-2 hover:bg-slate-100 md:hidden">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
