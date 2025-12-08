import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

// AuthForm component
const AuthForm = ({ type, email, setEmail, password, setPassword, handleSubmit, isLoading }) => (
  <div className="flex flex-col gap-5">
    <div className="relative">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-4 bg-slate-800 rounded-xl text-white border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-base transition-all"
        required
        autoComplete="off"
      />
    </div>
    {type !== "forgot" && (
      <div className="relative">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-4 bg-slate-800 rounded-xl text-white border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-base transition-all"
          required
          autoComplete="off"
        />
      </div>
    )}
    <button
      onClick={() => handleSubmit(type)}
      disabled={isLoading}
      className={`btn-primary ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        type === "signup" ? "Create Account" : type === "login" ? "Sign In" : "Reset Password"
      )}
    </button>
  </div>
);

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState("default");
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const { login, signup, forgotPassword, loading } = useAuth();

  const handleFlip = () => {
    setError(null);
    setEmail("");
    setPassword("");
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (type) => {
    setError(null);

    try {
      if (type === "login") {
        await login(email, password);
        navigate("/");
      } else if (type === "signup") {
        await signup(email, password);
        handleFlip();
        setTimeout(() => setError("Account created! Please check your email to verify."), 600);
      } else if (type === "forgot") {
        await forgotPassword(email);
        setEmail("");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {authMode === "default" ? (
        <div className="relative w-full max-w-md z-10">
          {/* 3D Flip Card Container */}
          <div className="perspective-1000">
            <div 
              className={`relative w-full min-h-[600px] transition-transform duration-700 ${
                isSignUp ? 'rotate-y-180' : 'rotate-y-0'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side - Login */}
              <div 
                className="absolute inset-0 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-full h-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-lg">
                      <span className="text-4xl font-bold text-white">C</span>
                    </div>
                    <h2 className="text-4xl font-bold professional-title gradient-text mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-slate-400 text-sm">Sign in to continue to Commentility</p>
                  </div>

                  {error && !isSignUp && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm text-center fade-in-up">
                      {error}
                    </div>
                  )}

                  {!isSignUp && (
                    <AuthForm 
                      type="login" 
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      handleSubmit={handleSubmit}
                      isLoading={loading}
                    />
                  )}

                  {!isSignUp && (
                    <>
                      <button
                        className="mt-4 text-blue-400 text-sm w-full text-center transition-colors hover:text-blue-300"
                        onClick={() => {
                          setAuthMode("forgot");
                          setError(null);
                        }}
                      >
                        Forgot your password?
                      </button>

                      <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm mb-3">
                          New to Commentility?
                        </p>
                        <button
                          onClick={handleFlip}
                          className="px-8 py-3 bg-transparent border-2 border-blue-500 text-blue-400 font-semibold rounded-xl transition-all hover:bg-blue-500 hover:text-white"
                        >
                          Create Account
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Back Side - Signup */}
              <div 
                className="absolute inset-0 backface-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-full h-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-4xl font-bold text-white">C</span>
                    </div>
                    <h2 className="text-4xl font-bold professional-title gradient-text mb-2">
                      Join Commentility
                    </h2>
                    <p className="text-slate-400 text-sm">Create your account to get started</p>
                  </div>

                  {error && isSignUp && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm text-center fade-in-up">
                      {error}
                    </div>
                  )}

                  {isSignUp && (
                    <AuthForm 
                      type="signup" 
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      handleSubmit={handleSubmit}
                      isLoading={loading}
                    />
                  )}

                  {isSignUp && (
                    <div className="mt-6 text-center">
                      <p className="text-slate-400 text-sm mb-3">
                        Already have an account?
                      </p>
                      <button
                        onClick={handleFlip}
                        className="px-8 py-3 bg-transparent border-2 border-green-500 text-green-400 font-semibold rounded-xl transition-all hover:bg-green-500 hover:text-white"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Forgot Password Screen
        <div className="w-full max-w-md z-10 fade-in-up">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-lg">
                <span className="text-4xl">🔐</span>
              </div>
              <h2 className="text-3xl font-bold professional-title gradient-text mb-2">
                Reset Password
              </h2>
              <p className="text-slate-400 text-sm">
                Enter your email to receive reset instructions
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm text-center fade-in-up">
                {error}
              </div>
            )}

            <AuthForm 
              type="forgot" 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
              isLoading={loading}
            />

            <button
              className="mt-6 text-blue-400 text-sm w-full text-center transition-colors hover:text-blue-300"
              onClick={() => {
                setAuthMode("default");
                setError(null);
                setEmail("");
                setPassword("");
              }}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      )}

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default LoginSignup;