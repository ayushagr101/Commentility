import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, ArrowRight, Mail, Lock, User, Github, Chrome } from 'lucide-react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const baseStyle = "w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#E68A1D] hover:bg-[#d57d18] text-white shadow-sm hover:shadow-md",
    outline: "border border-gray-200 hover:border-[#E68A1D] hover:bg-orange-50 text-gray-700 bg-white",
    ghost: "text-gray-500 hover:text-[#E68A1D] hover:bg-orange-50"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type, placeholder, icon: Icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 ml-1 block">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E68A1D] transition-colors">
          <Icon size={20} />
        </div>
        <input
          type={isPassword && showPassword ? 'text' : type}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#E68A1D] focus:ring-4 focus:ring-orange-100 transition-all text-gray-800 placeholder-gray-400"
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SocialButton = ({ icon: Icon, label }) => (
  <button className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group">
    <Icon size={20} className="text-gray-600 group-hover:text-gray-900" />
    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{label}</span>
  </button>
);

export default function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer">
          <Sparkles className="text-[#E68A1D]" size={24} />
          <span className="text-xl font-bold tracking-tight text-slate-800">Commentility</span>
        </div>
        <div className="hidden md:block">
           <span className="text-sm text-gray-500 mr-4">Need help?</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 mt-16 relative overflow-hidden">
        
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-md relative z-10">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 mb-6 relative">
              <Sparkles className="text-[#E68A1D] animate-pulse" size={32} />
              <div className="absolute inset-0 rounded-full border border-orange-100 scale-125 opacity-50"></div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-gray-500 max-w-xs mx-auto">
              {isLogin 
                ? 'Enter your details to access your workspace.' 
                : 'Get started with Commentility today.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              
              {!isLogin && (
                <Input 
                  label="Full Name" 
                  type="text" 
                  placeholder="John Doe" 
                  icon={User}
                />
              )}
              
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@company.com" 
                icon={Mail}
              />
              
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                icon={Lock}
              />

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#E68A1D] focus:ring-[#E68A1D] cursor-pointer" />
                    <span className="text-gray-500 group-hover:text-gray-700">Remember me</span>
                  </label>
                  <a href="#" className="text-[#E68A1D] font-medium hover:text-[#c47113]">Forgot password?</a>
                </div>
              )}

              <Button type="submit">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </Button>
            </form>

            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="flex gap-4">
              <SocialButton icon={Chrome} label="Google" />
              <SocialButton icon={Github} label="GitHub" />
            </div>
          </div>

          <p className="text-center mt-8 text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#E68A1D] font-semibold hover:text-[#c47113] hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        <p>© 2024 Commentility. All rights reserved.</p>
      </footer>
    </div>
  );
}