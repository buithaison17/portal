import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiFeedback, setApiFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    } else if (name.trim().length < 2) {
      newErrors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!email) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không đúng định dạng (VD: example@domain.com)";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiFeedback(null);

    if (!validate()) return;

    setLoading(true);

    // Simulate Register API Request
    setTimeout(() => {
      setLoading(false);
      
      // For demonstration, let's treat any registration as successful
      setApiFeedback({
        type: "success",
        message: "Đăng ký tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-2 min-h-[640px] z-10">
        
        {/* Left Side: Brand & Marketing Column (Matches Login) */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden">
          {/* Subtle overlay grid patterns */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3 z-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">EduLearn</h1>
              <p className="text-xs text-blue-200">Learn Every Day</p>
            </div>
          </div>

          {/* Inspirational Text & Graphics */}
          <div className="my-auto space-y-6 z-10">
            <h2 className="text-3xl font-extrabold leading-tight">
              Tạo tài khoản miễn phí <br /> và bắt đầu học ngay.
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed max-w-xs">
              Gia nhập cùng hơn 100,000 học viên khác trên toàn thế giới để phát triển kỹ năng lập trình, thiết kế, kinh doanh và hơn thế nữa.
            </p>
            
            {/* Short Highlights */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-blue-100">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Không tốn chi phí khởi tạo tài khoản</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-100">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Nhận chứng chỉ hoàn thành khóa học</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-100">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Lưu trữ tiến trình học tập trọn đời</span>
              </div>
            </div>
          </div>

          {/* Footer of Left Panel */}
          <div className="text-xs text-blue-200/60 z-10">
            © 2026 EduLearn Inc. Bảo lưu mọi quyền.
          </div>

          {/* Blur circles inside left panel */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </div>

        {/* Right Side: Authentication Form Column */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          
          {/* Header text */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký tài khoản</h3>
            <p className="text-slate-500 text-sm">
              Đăng ký nhanh chóng để truy cập các khóa học tuyệt vời.
            </p>
          </div>

          {/* Alert messages */}
          {apiFeedback && (
            <div
              className={`p-4 mb-5 rounded-xl flex items-start gap-3 text-sm animate-fade-in ${
                apiFeedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                  : "bg-rose-50 text-rose-800 border border-rose-100"
              }`}
            >
              {apiFeedback.type === "success" ? (
                <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-rose-600 mt-0.5 shrink-0" />
              )}
              <span>{apiFeedback.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Họ và Tên
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border outline-none text-slate-800 text-sm transition-all duration-200 ${
                    errors.name
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium animate-fade-in">
                  <AlertCircle size={12} /> {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Địa chỉ Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border outline-none text-slate-800 text-sm transition-all duration-200 ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium animate-fade-in">
                  <AlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Mật khẩu của bạn"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full pl-11 pr-11 py-2.5 rounded-xl border outline-none text-slate-800 text-sm transition-all duration-200 ${
                    errors.password
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium animate-fade-in">
                  <AlertCircle size={12} /> {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  className={`w-full pl-11 pr-11 py-2.5 rounded-xl border outline-none text-slate-800 text-sm transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium animate-fade-in">
                  <AlertCircle size={12} /> {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                defaultChecked
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 accent-blue-600 mt-0.5"
              />
              <label htmlFor="terms" className="ml-2.5 block text-xs text-slate-600 font-medium select-none leading-relaxed">
                Tôi đồng ý với{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Chính sách bảo mật
                </a>{" "}
                của EduLearn.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] pt-2.5 ${
                loading ? "opacity-85 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang khởi tạo tài khoản...
                </>
              ) : (
                <>
                  Đăng ký ngay <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer redirection */}
          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-bold">
              Đăng nhập
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
