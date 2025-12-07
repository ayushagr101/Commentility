import React from "react";

export const ButtonColourfull = ({ text, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
        disabled
          ? "bg-gray-600 cursor-not-allowed opacity-50"
          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:scale-105 active:scale-95"
      }`}
    >
      {disabled ? "Loading..." : text}
    </button>
  );
};
