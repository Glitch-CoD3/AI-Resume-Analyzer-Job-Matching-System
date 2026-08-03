import React from "react";

export default function RightPanel({ user, totalReports, activeSessionsCount }) {
  return (
    <div className="w-80 p-5 bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col justify-between">
      <div>
        {/* USER CARD */}
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
            className="w-12 h-12 rounded-full bg-white/10 p-1"
            alt="user avatar"
          />
          <div className="overflow-hidden">
            <h2 className="font-semibold truncate">{user.username}</h2>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* DYNAMIC STATS */}
        <div className="mt-6 space-y-3">
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/20 border border-purple-500/20">
            ⚡ Total Reports: {totalReports}
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-600/30 to-blue-600/20 border border-green-500/20">
            📊 Active Sessions: {activeSessionsCount}
          </div>
        </div>
      </div>

      {/* TIP CARD */}
      <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/10">
        <p className="text-sm text-gray-300">
          💡 Tip: Click on past reports in history to inspect previous results without submitting new data.
        </p>
      </div>
    </div>
  );
}