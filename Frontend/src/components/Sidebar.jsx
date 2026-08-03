import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../src/api/axiosInstance.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  historyList,
  selectedHistoryId,
  isNewReportMode,
  handleStartNewReport,
  fetchReportById,
  handleDeleteHistory,
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  const { checkAuthStatus } = useAuth();

  // Logout Handler
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Clear httpOnly cookie
      await AxiosInstance.post("/auth/logout");

      // Update auth state
      await checkAuthStatus();

      // Redirect to login
      navigate("/login", { replace: true });

    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"
        } bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col`}
    >
      {/* NEW ANALYSIS BUTTON */}
      <div className="p-3">
        <button
          onClick={handleStartNewReport}
          className={`w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition text-sm flex items-center justify-center gap-2 border border-blue-400/30 shadow-lg ${isNewReportMode ? "ring-2 ring-blue-400" : ""
            }`}
        >
          <span>+</span>
          {sidebarOpen && <span>New Analysis</span>}
        </button>
      </div>

      {/* SIDEBAR HEADER */}
      <div className="px-4 py-2 flex items-center justify-between">
        <h1
          className={`font-bold text-xs uppercase text-gray-400 ${!sidebarOpen && "hidden"
            }`}
        >
          History
        </h1>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 ml-auto"
        >
          {sidebarOpen ? "⟨" : "⟩"}
        </button>
      </div>

      {/* HISTORY */}
      <div className="flex-1 overflow-y-auto px-2 space-y-2">
        {historyList.map((item) => {
          const analysisId = Array.isArray(item.analysisIds)
            ? item.analysisIds[0]
            : item.analysisIds;

          const isSelected =
            selectedHistoryId === item._id && !isNewReportMode;

          return (
            <div
              key={item._id}
              onClick={() => fetchReportById(analysisId, item._id)}
              className={`group relative p-3 rounded-xl cursor-pointer transition-all flex flex-col gap-1 ${isSelected
                  ? "bg-blue-600/30 border border-blue-500 text-blue-300"
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm truncate flex-1">
                  {sidebarOpen
                    ? item.historyTitle || "Resume Analysis"
                    : "📄"}
                </span>

                <div className="flex items-center gap-1.5">
                  {isSelected && (
                    <span className="text-blue-400 text-xs">●</span>
                  )}

                  <button
                    type="button"
                    title="Delete report"
                    onClick={(e) => handleDeleteHistory(e, item._id)}
                    className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {sidebarOpen && item.createdAt && (
                <span className="text-[10px] text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-3 space-y-2 border-t border-white/5">
        <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm font-medium">
          {sidebarOpen ? "Settings" : "⚙️"}
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
        >
          {isLoggingOut
            ? "Logging out..."
            : sidebarOpen
              ? "Logout"
              : "🚪"}
        </button>
      </div>
    </div>
  );
}