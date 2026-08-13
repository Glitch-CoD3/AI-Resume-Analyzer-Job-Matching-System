import React from "react";
import { Link } from "react-router-dom"; // Use <Link> for React Router, or replace with <a> tag

export default function Header({ verified, onGoHome }) {
  return (
    <header className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 border-b border-white/10 backdrop-blur-xl flex justify-between items-center gap-3 shrink-0">
      {/* Logo + Title Container */}
      <Link
        to="/"
        onClick={onGoHome}
        className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-1 py-0.5 transition-all"
      >
        {/* Modern AI Resume Logo */}
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full bg-[#080c14] rounded-[11px] flex items-center justify-center relative overflow-hidden">
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors" />

            {/* Document / Resume Icon with AI Sparkle */}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-cyan-300 transition-colors relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Document Base */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 12h6m-6 4h4m5 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
              />
              {/* AI Sparkle Node */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 3.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z"
                className="fill-cyan-400 text-cyan-400"
              />
            </svg>
          </div>
        </div>

        {/* Brand Text */}
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors truncate">
          AI Resume <span className="text-blue-400">Analyzer</span>
        </h1>
      </Link>

      {/* Verified Badge */}
      {verified && (
        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full border border-green-500/30 shrink-0 select-none shadow-sm">
          <span>✓</span>
          <span className="hidden xs:inline sm:inline">Verified Account</span>
          <span className="inline xs:hidden sm:hidden">Verified</span>
        </span>
      )}
    </header>
  );
}