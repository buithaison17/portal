import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiFeedback, setApiFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiFeedback(null);

    if (!validate()) return;

    setLoading(true);

    // Simulate an API Request
    setTimeout(() => {
      setLoading(false);
      if (email === "demo@edulearn.com" && password === "123456") {
        setApiFeedback({
          type: "success",
          message: "Đăng nhập thành công! Đang chuyển hướng về trang chủ...",
        });
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setApiFeedback({
          type: "error",
          message: "Email hoặc mật khẩu không chính xác (Tài khoản mẫu: demo@edulearn.com / 123456)",
        });
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-2 min-h-[580px] z-10">
        
        {/* Left Side: Brand & Marketing Column */}
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
              Bắt đầu hành trình <br /> học tập trực tuyến cùng chúng tôi.
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed max-w-xs">
              Truy cập hàng ngàn khoá học chất lượng từ các giảng viên hàng đầu thế giới. Nâng cấp kỹ năng của bạn ngay hôm nay.
            </p>
            
            {/* Short Stats or Highlights */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-blue-100">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Học trực tuyến mọi lúc, mọi nơi</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-100">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Lộ trình học cá nhân hóa</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-100">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Cộng đồng hỗ trợ 24/7</span>
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
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Chào mừng trở lại!</h3>
            <p className="text-slate-500 text-sm">
              Nhập thông tin đăng nhập của bạn để truy cập hệ thống.
            </p>
          </div>

          {/* Alert messages */}
          {apiFeedback && (
            <div
              className={`p-4 mb-6 rounded-xl flex items-start gap-3 text-sm animate-fade-in ${
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

          {/* Forms */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
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
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-slate-800 text-sm transition-all duration-200 ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Mật khẩu
                </label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border outline-none text-slate-800 text-sm transition-all duration-200 ${
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
                <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle size={12} /> {errors.password}
                </span>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 accent-blue-600"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs text-slate-600 font-medium select-none">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] ${
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
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social Logins Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3.5 text-slate-400 font-medium tracking-wide">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => alert("Đăng nhập với Google chưa được tích hợp thực tế.")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition duration-150 cursor-pointer"
            >
              {/* Google Icon SVG */}
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.37 1 3.42 3.66 1.5 7.57l3.79 2.93c.89-2.67 3.39-4.46 6.71-4.46z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.46-1.1 2.69-2.33 3.51l3.6 2.8c2.1-1.94 3.78-4.8 3.78-8.44z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.29 14.77c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.5 7.48C.54 9.4 0 11.53 0 13.8s.54 4.4 1.5 6.32l3.79-3.03z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.5 1.18-4.36 1.18-3.32 0-5.82-1.79-6.71-4.46l-3.79 2.93C3.42 20.34 7.37 23 12 23z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Đăng nhập với GitHub chưa được tích hợp thực tế.")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition duration-150 cursor-pointer"
            >
              {/* GitHub Icon SVG */}
              <svg className="h-4 w-4 shrink-0 text-slate-800 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Footer redirection */}
          <div className="mt-8 text-center text-xs text-slate-500 font-medium">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-bold">
              Đăng ký ngay
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
