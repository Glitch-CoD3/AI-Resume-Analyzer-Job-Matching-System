import React, { useEffect, useState } from "react";
import AxiosInstance from "../../api/axiosInstance.jsx";

// Sub-components
import Header from "../../components/Header.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import ReportDisplay from "../../components/ReportDisplay.jsx";
import AnalysisForm from "../../components/AnalysisForm.jsx";
import RightPanel from "../../components/RightPanel.jsx";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false); // Closed by default
  const [user, setUser] = useState({ username: "Loading...", email: "" });
  const [activeReport, setActiveReport] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewReportMode, setIsNewReportMode] = useState(false);

  const [form, setForm] = useState({
    resume: "",
    selfDescribe: "",
    jobDescription: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStartNewReport = () => {
    setActiveReport(null);
    setSelectedHistoryId(null);
    setIsNewReportMode(true);
  };

  // Fetch single report by analysis ID
  const fetchReportById = async (analysisId, historyId) => {
    let cleanId = analysisId;
    if (typeof cleanId === "object" && cleanId !== null) {
      cleanId = cleanId._id || cleanId.id || (Array.isArray(cleanId) ? cleanId[0] : null);
    }

    if (!cleanId || typeof cleanId !== "string") return;

    setLoadingReport(true);
    setIsNewReportMode(false);
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

  // Delete history item
  const handleDeleteHistory = async (e, historyId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report from history?")) return;

    try {
      await AxiosInstance.delete(`/history/${historyId}`);
      setHistoryList((prev) => prev.filter((item) => item._id !== historyId));

      if (selectedHistoryId === historyId) {
        handleStartNewReport();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete history item.");
    }
  };

  // Fetch Dashboard Profile + History
  const fetchUserDetails = async () => {
    try {
      const [dashboardDetails, historyResponse] = await Promise.all([
        AxiosInstance.get("/dashboard/details"),
        AxiosInstance.get("/history"),
      ]);

      if (dashboardDetails.data?.data) {
        const { user, activeSessions } = dashboardDetails.data.data;
        setUser(user || {});
        setActiveSessions(activeSessions || []);
      }

      if (historyResponse.data?.success) {
        const rawData = historyResponse.data.data;
        const fetchedHistory = Array.isArray(rawData) ? rawData : [];

        setHistoryList(fetchedHistory);

        if (fetchedHistory.length > 0 && !selectedHistoryId && !isNewReportMode) {
          const latestItem = fetchedHistory[0];
          const latestAnalysisId = Array.isArray(latestItem.analysisIds)
            ? latestItem.analysisIds[0]
            : latestItem.analysisIds;

          if (latestAnalysisId) {
            fetchReportById(latestAnalysisId, latestItem._id);
          }
        } else {
          setIsNewReportMode(true);
        }
      } else {
        setHistoryList([]);
        setIsNewReportMode(true);
      }
    } catch (error) {
      setHistoryList([]);
      alert(error.response?.data?.message || error.message);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.resume || !form.jobDescription) {
      alert("Please enter both a Resume and a Job Description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await AxiosInstance.post("/reports", {
        resume: form.resume,
        selfdescribe: form.selfDescribe,
        jobdescribe: form.jobDescription,
      });

      if (response.data?.success || response.data) {
        const createdReport = response.data.data || response.data;

        setForm({ resume: "", selfDescribe: "", jobDescription: "" });
        setActiveReport(createdReport);
        setIsNewReportMode(false);

        await fetchUserDetails();
      }
    } catch (error) {
      console.error("Full Submission Error:", error);
      console.error("Backend Response Data:", error.response?.data);
      console.error("HTTP Status Code:", error.response?.status);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to submit analysis request.";

      alert(`Error (${error.response?.status || "Network"}): ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const currentTitle = isNewReportMode
    ? "Create New Resume Analysis"
    : (Array.isArray(historyList) ? historyList : []).find((item) => item._id === selectedHistoryId)?.historyTitle ||
    (activeReport?.jobDescription
      ? `Analysis for: ${activeReport.jobDescription.slice(0, 45)}...`
      : "Comprehensive Analysis Report");

  return (
    <div className="h-screen w-full flex flex-col bg-[#080c14] text-gray-100 overflow-hidden font-sans">
      <Header verified={user.verified} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          historyList={historyList}
          selectedHistoryId={selectedHistoryId}
          isNewReportMode={isNewReportMode}
          handleStartNewReport={handleStartNewReport}
          fetchReportById={fetchReportById}
          handleDeleteHistory={handleDeleteHistory}
        />

        {/* CENTER PANEL */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden bg-gradient-to-b from-[#0e1424]/50 to-transparent transition-all duration-300 relative">
          <div className="mb-4 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-bold text-gray-100 truncate pr-4 tracking-tight">
              {currentTitle}
            </h2>

            <div className="flex items-center gap-3">
              {activeReport?._id && !isNewReportMode && (
                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 shrink-0">
                  ID: {activeReport._id}
                </span>
              )}

              {/* Profile Toggle Button */}
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all focus:outline-none ${rightPanelOpen
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
                title={rightPanelOpen ? "Close Profile Details" : "View Profile Details"}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username || "User avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (user.username || "J").charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium tracking-wide max-w-[120px] truncate">
                  {user.username || "Profile"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${rightPanelOpen ? "rotate-180" : "rotate-0"
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-2xl bg-white/[0.03] border border-white/10 p-6 overflow-y-auto shadow-2xl backdrop-blur-xl">
            <ReportDisplay
              loadingReport={loadingReport}
              isNewReportMode={isNewReportMode}
              activeReport={activeReport}
            />
          </div>

          {isNewReportMode && (
            <AnalysisForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* RIGHT PANEL WRAPPER */}
        <div
          className={`transition-all duration-300 ease-in-out flex overflow-hidden border-l border-white/5 ${rightPanelOpen ? "w-80 opacity-100" : "w-0 opacity-0"
            }`}
        >
          <div className="w-80 h-full shrink-0">
            <RightPanel
              user={user}
              totalReports={historyList.length}
              activeSessionsCount={activeSessions.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}