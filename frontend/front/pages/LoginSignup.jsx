import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import Balatro from "./Balatro";
// AuthForm component moved outside to prevent re-creation on every render
const AuthForm = ({ type, email, setEmail, password, setPassword, handleSubmit, isLoading }) => (
  <div className="flex flex-col gap-5">
    <div className="relative">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-4 bg-black bg-opacity-40 rounded-xl text-white border-2 border-cyan-500 border-opacity-30 focus:border-cyan-400 outline-none text-base transition-all duration-300"
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
          className="w-full px-4 py-4 bg-black bg-opacity-40 rounded-xl text-white border-2 border-cyan-500 border-opacity-30 focus:border-cyan-400 outline-none text-base transition-all duration-300"
          required
          autoComplete="off"
        />
      </div>
    )}
    <button
      onClick={() => handleSubmit(type)}
      disabled={isLoading}
      className={`w-full px-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl border-none shadow-lg shadow-cyan-500/30 text-base transition-all duration-300 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
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
        // Navigate to homepage on successful login
        navigate("/");
      } else if (type === "signup") {
        await signup(email, password);
        // Show success message and flip to login
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background with ColorBends */}
      <div className="absolute inset-0 opacity-100">
        <Balatro
  isRotate={false}
  mouseInteraction={false}
  pixelFilter={700}
/>
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
                <div className="w-full h-full bg-gradient-to-br from-gray-800 via-black to-gray-800 border-2 border-cyan-500 border-opacity-30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-spin" style={{ animationDuration: '20s' }}>
                      <span className="text-4xl font-bold text-white">C</span>
                    </div>
                    <h2 className="text-4xl font-white neon-cyan mb-4 retro-title">
                      Welcome
                    </h2>
                  </div>

                  {error && !isSignUp && (
                    <div className="mb-4 p-3 bg-cyan-500 bg-opacity-10 border border-cyan-500 border-opacity-50 rounded-lg text-cyan-400 text-sm text-center animate-fadeIn">
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
                        className="mt-4 text-cyan-400 text-opacity-70 text-sm w-full text-center bg-none border-none cursor-pointer transition-colors duration-300 hover:text-cyan-300"
                        onClick={() => {
                          setAuthMode("forgot");
                          setError(null);
                        }}
                      >
                        Lost your password?
                      </button>

                      <div className="mt-6 text-center">
                        <p className="text-cyan-400 text-opacity-50 text-sm mb-3">
                          New to Commentility?
                        </p>
                        <button
                          onClick={handleFlip}
                          className="px-8 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-cyan-500 hover:text-white"
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
                <div className="w-full h-full bg-gradient-to-br from-gray-800 via-black to-gray-800 border-2 border-cyan-500 border-opacity-30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                      <span className="text-4xl font-bold text-white">C</span>
                    </div>
                    <h2 className="text-4xl font-white neon-cyan mb-2 retro-title">
                      Join Commentility
                    </h2>
                    <p className="text-cyan-400 text-opacity-70 text-sm">
                      Start Your Journey
                    </p>
                  </div>

                  {error && isSignUp && (
                    <div className="mb-4 p-3 bg-cyan-500 bg-opacity-10 border border-cyan-500 border-opacity-50 rounded-lg text-cyan-400 text-sm text-center animate-fadeIn">
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
                      <p className="text-cyan-400 text-opacity-50 text-sm mb-3">
                        Already have an account?
                      </p>
                      <button
                        onClick={handleFlip}
                        className="px-8 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-cyan-500 hover:text-white"
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
        <div className="w-full max-w-md z-10 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 via-black to-gray-800 border-2 border-cyan-500 border-opacity-30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-spin" style={{ animationDuration: '20s' }}>
                <span className="text-4xl font-bold text-black">🔐</span>
              </div>
              <h2 className="text-3xl font-black neon-cyan mb-2 retro-title">
                Reset Password
              </h2>
              <p className="text-cyan-400 text-opacity-70 text-sm">
                Enter your email to receive reset instructions
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-cyan-500 bg-opacity-10 border border-cyan-500 border-opacity-50 rounded-lg text-cyan-400 text-sm text-center animate-fadeIn">
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
              className="mt-6 text-cyan-400 text-opacity-70 text-sm w-full text-center bg-none border-none cursor-pointer transition-colors duration-300 hover:text-cyan-300"
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
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
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginSignup;