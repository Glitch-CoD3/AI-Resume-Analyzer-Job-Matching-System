import React, { useEffect, useState } from "react";
import AxiosInstance from "../../api/axiosInstance.jsx";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({ username: "Loading...", email: "" });
  const [activeReport, setActiveReport] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state to toggle input visibility
  const [isNewReportMode, setIsNewReportMode] = useState(true);

  const [form, setForm] = useState({
    resume: "",
    selfDescribe: "",
    jobDescription: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Switch to New Report mode (clears active report selection)
  const handleStartNewReport = () => {
    setActiveReport(null);
    setSelectedHistoryId(null);
    setIsNewReportMode(true);
  };

  // 1. Fetch full report details by single Analysis ID safely
  const fetchReportById = async (analysisId, historyId) => {
    let cleanId = analysisId;
    if (typeof cleanId === "object" && cleanId !== null) {
      cleanId = cleanId._id || cleanId.id || (Array.isArray(cleanId) ? cleanId[0] : null);
    }

    if (!cleanId || typeof cleanId !== "string") {
      console.warn("Invalid analysis ID provided:", analysisId);
      return;
    }

    setLoadingReport(true);
    setIsNewReportMode(false); // Hide creation form when inspecting a past report
    if (historyId) setSelectedHistoryId(historyId);

    try {
      const response = await AxiosInstance.get(`/reports/${cleanId}`);
      if (response.data?.success || response.data) {
        setActiveReport(response.data.data || response.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch report details");
    } finally {
      setLoadingReport(false);
    }
  };

  // 2. Fetch User Profile and History on Mount (No auto-selection of report)
  const fetchUserDetails = async () => {
    try {
      const [dashboardDetails, historyResponse] = await Promise.all([
        AxiosInstance.get("/dashboard/details"),
        AxiosInstance.get("/dashboard/history"),
      ]);

      if (dashboardDetails.data?.data) {
        const { user, activeSessions } = dashboardDetails.data.data;
        setUser(user || {});
        setActiveSessions(activeSessions || []);
      }

      if (historyResponse.data?.success) {
        setHistoryList(historyResponse.data.data || []);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  // 3. Submit New Resume Analysis
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.resume || !form.jobDescription) {
      alert("Please enter both a Resume and a Job Description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await AxiosInstance.post("/reports", {
        resumeText: form.resume,
        selfDescription: form.selfDescribe,
        jobDescription: form.jobDescription,
      });

      if (response.data?.success || response.data) {
        const createdReport = response.data.data || response.data;

        // Reset form
        setForm({
          resume: "",
          selfDescribe: "",
          jobDescription: "",
        });

        // Show created report & update mode
        setActiveReport(createdReport);
        setIsNewReportMode(false);

        // Refresh sidebar history
        await fetchUserDetails();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit analysis request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Title Handler
  const currentTitle = isNewReportMode
    ? "Create New Resume Analysis"
    : historyList.find((item) => item._id === selectedHistoryId)?.historyTitle ||
      (activeReport?.jobDescription
        ? `Analysis for: ${activeReport.jobDescription.slice(0, 45)}...`
        : "Comprehensive Analysis Report");

  return (
    <div className="h-screen w-full flex flex-col bg-[#0b0f1a] text-white overflow-hidden">
      {/* TOP HEADER */}
      <div className="w-full px-6 py-3 bg-white/5 border-b border-white/10 backdrop-blur-xl flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide text-blue-400">
          AI Resume Analyzer
        </h1>
        {user.verified && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full border border-green-500/30">
            ✓ Verified Account
          </span>
        )}
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-20"
          } bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col`}
        >
          {/* NEW ANALYSIS BUTTON */}
          <div className="p-3">
            <button
              onClick={handleStartNewReport}
              className={`w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition text-sm flex items-center justify-center gap-2 border border-blue-400/30 shadow-lg ${
                isNewReportMode ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <span>+</span>
              {sidebarOpen && <span>New Analysis</span>}
            </button>
          </div>

          {/* SIDEBAR HEADER */}
          <div className="px-4 py-2 flex items-center justify-between">
            <h1 className={`font-bold text-xs uppercase text-gray-400 ${!sidebarOpen && "hidden"}`}>
              History
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 ml-auto"
            >
              {sidebarOpen ? "⟨" : "⟩"}
            </button>
          </div>

          {/* HISTORY LIST */}
          <div className="flex-1 overflow-y-auto px-2 space-y-2">
            {historyList.map((item) => {
              const analysisId = Array.isArray(item.analysisIds)
                ? item.analysisIds[0]
                : item.analysisIds;
              const isSelected = selectedHistoryId === item._id && !isNewReportMode;

              return (
                <div
                  key={item._id}
                  onClick={() => fetchReportById(analysisId, item._id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex flex-col gap-1 ${
                    isSelected
                      ? "bg-blue-600/30 border border-blue-500 text-blue-300"
                      : "bg-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">
                      {sidebarOpen
                        ? item.historyTitle || "Resume Analysis"
                        : "📄"}
                    </span>
                    {isSelected && <span className="text-blue-400">●</span>}
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

          {/* SIDEBAR BOTTOM */}
          <div className="p-3 space-y-2 border-t border-white/5">
            <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm font-medium">
              Settings
            </button>
            <button className="w-full py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-sm font-medium">
              Logout
            </button>
          </div>
        </div>

        {/* CENTER MAIN REPORT / FORM AREA */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100 truncate pr-4">
              {currentTitle}
            </h2>
            {activeReport?._id && !isNewReportMode && (
              <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 shrink-0">
                ID: {activeReport._id}
              </span>
            )}
          </div>

          {/* DISPLAY VIEW AREA */}
          <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-6 overflow-y-auto shadow-lg space-y-6">
            {loadingReport ? (
              <div className="h-full flex items-center justify-center text-blue-400">
                Loading report details...
              </div>
            ) : isNewReportMode ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-3">
                <div className="text-5xl">📄</div>
                <h3 className="text-lg font-semibold text-gray-200">
                  Ready for a New Analysis
                </h3>
                <p className="text-sm max-w-md text-gray-400">
                  Fill in your resume, target job description, and optional self-description in the fields below to generate an AI report.
                </p>
              </div>
            ) : activeReport ? (
              <div className="space-y-6">
                {/* EXECUTIVE SUMMARY */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    Executive Summary
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {activeReport.summary || "No summary provided."}
                  </p>
                </div>

                {/* KEYWORD ANALYSIS */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">
                    Keyword Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-400 font-medium">Matched Keywords:</span>
                      {activeReport.keywordAnalysis?.matchedKeywords?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activeReport.keywordAnalysis.matchedKeywords.map((kw, i) => (
                            <span key={i} className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs border border-green-500/30">
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-xs mt-1">None detected</p>
                      )}
                    </div>
                    <div>
                      <span className="text-red-400 font-medium">Missing Keywords:</span>
                      {activeReport.keywordAnalysis?.missingKeywords?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activeReport.keywordAnalysis.missingKeywords.map((kw, i) => (
                            <span key={i} className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs border border-red-500/30">
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-xs mt-1">None detected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* RESUME ISSUES */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    Resume Issues ({activeReport.resumeIssues?.length || 0})
                  </h3>
                  {activeReport.resumeIssues?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                      {activeReport.resumeIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-xs">No issues flagged.</p>
                  )}
                </div>

                {/* IMPROVEMENT SUGGESTIONS */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Improvement Suggestions ({activeReport.improvementSuggestions?.length || 0})
                  </h3>
                  {activeReport.improvementSuggestions?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                      {activeReport.improvementSuggestions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-xs">No improvement suggestions available.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a report from history or click "+ New Analysis".
              </div>
            )}
          </div>

          {/* INPUT FORM (ONLY SHOWN IN NEW REPORT MODE) */}
          {isNewReportMode && (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <textarea
                  name="resume"
                  rows={2}
                  value={form.resume}
                  onChange={handleChange}
                  placeholder="Paste resume here *"
                  disabled={isSubmitting}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
                />
                <textarea
                  name="selfDescribe"
                  rows={2}
                  value={form.selfDescribe}
                  onChange={handleChange}
                  placeholder="Self-Describe (Optional)"
                  disabled={isSubmitting}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
                />
                <textarea
                  name="jobDescription"
                  rows={2}
                  value={form.jobDescription}
                  onChange={handleChange}
                  placeholder="Paste Job-Description *"
                  disabled={isSubmitting}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
                />
              </div>

              {/* RIGHT DOWN SUBMIT BUTTON */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition text-sm disabled:opacity-50 border border-blue-400/30 shadow-lg flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze →"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT DASHBOARD PANEL */}
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
                ⚡ Total Reports: {historyList.length}
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-600/30 to-blue-600/20 border border-green-500/20">
                📊 Active Sessions: {activeSessions.length}
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
      </div>
    </div>
  );
}