import React from "react";

export default function Header({ verified }) {
  return (
    <div className="w-full px-6 py-3 bg-white/5 border-b border-white/10 backdrop-blur-xl flex justify-between items-center">
      <h1 className="text-xl font-bold tracking-wide text-blue-400">
        AI Resume Analyzer
      </h1>
      {verified && (
        <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full border border-green-500/30">
          ✓ Verified Account
        </span>
      )}
    </div>
  );
}