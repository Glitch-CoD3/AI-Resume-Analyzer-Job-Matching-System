import React from "react";

export default function ReportDisplay({ loadingReport, isNewReportMode, activeReport }) {
    if (loadingReport) {
        return (
            <div className="h-full flex items-center justify-center text-blue-400">
                Loading report details...
            </div>
        );
    }

    if (isNewReportMode) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-3">
                <div className="text-5xl">📄</div>
                <h3 className="text-lg font-semibold text-gray-200">
                    Ready for a New Analysis
                </h3>
                <p className="text-sm max-w-md text-gray-400">
                    Fill in your resume, target job description, and optional self-description below to generate an AI report.
                </p>
            </div>
        );
    }

    if (!activeReport) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                Select a report from history or click "+ New Analysis".
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* SCORES SUMMARY BANNER */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                    <span className="text-xs text-gray-400 block">Overall Score</span>
                    <span className="text-xl font-bold text-blue-400">{activeReport.overallScore ?? 0}%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                    <span className="text-xs text-gray-400 block">Match Score</span>
                    <span className="text-xl font-bold text-emerald-400">{activeReport.matchScore ?? 0}%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                    <span className="text-xs text-gray-400 block">ATS Score</span>
                    <span className="text-xl font-bold text-purple-400">{activeReport.atsScore ?? 0}%</span>
                </div>
            </div>

            {/* 1. EXECUTIVE SUMMARY */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    Executive Summary
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                    {activeReport.summary || "No summary provided."}
                </p>
            </div>

            {/* 2. STRENGTHS */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    Key Strengths ({activeReport.strengths?.length || 0})
                </h3>
                {activeReport.strengths?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                        {activeReport.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-xs">No strengths recorded.</p>
                )}
            </div>

            {/* 3. KEYWORD ANALYSIS */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                    Keyword Analysis ({activeReport.keywordAnalysis?.keywordMatchPercentage ?? 0}% Match)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-green-400 font-medium">Matched Keywords:</span>
                        {activeReport.keywordAnalysis?.matchedKeywords?.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {activeReport.keywordAnalysis.matchedKeywords.map((kw, i) => (
                                    <span
                                        key={i}
                                        className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs border border-green-500/30"
                                    >
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
                                    <span
                                        key={i}
                                        className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs border border-red-500/30"
                                    >
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

            {/* 4. RESUME ISSUES */}
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

            {/* RESUME REWRITE EXAMPLE */}
            {activeReport.resumeRewrite && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-teal-400 mb-2">
                        Resume Bullet Rewrite Example
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p className="text-red-300 line-through bg-red-500/10 p-2 rounded border border-red-500/20">
                            <strong>Before:</strong> {activeReport.resumeRewrite.before}
                        </p>
                        <p className="text-emerald-300 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                            <strong>After:</strong> {activeReport.resumeRewrite.after}
                        </p>
                    </div>
                </div>
            )}

            {/* 5. SKILL GAPS */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                    Skill Gaps ({activeReport.skillGaps?.length || 0})
                </h3>
                {activeReport.skillGaps?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                        {activeReport.skillGaps.map((gap, index) => (
                            <li key={index}>
                                <strong>{gap.skill || gap}</strong>
                                {gap.severity && (
                                    <span className="ml-2 text-xs uppercase px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                                        {gap.severity}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-xs">No skill gaps detected.</p>
                )}
            </div>

            {/* 6. IMPROVEMENT SUGGESTIONS */}
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

            {/* 7. PREPARATION PLAN */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">
                    Preparation Plan ({activeReport.preparationPlan?.length || 0})
                </h3>
                {activeReport.preparationPlan?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                        {activeReport.preparationPlan.map((step, index) => (
                            <li key={index}>
                                {step.day ? <strong>Day {step.day} ({step.focus}): </strong> : null}
                                {step.task || step}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-xs">No preparation plan provided.</p>
                )}
            </div>

            {/* 8. LEARNING ROADMAP */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                    Learning Roadmap ({activeReport.learningRoadmap?.length || 0})
                </h3>
                {activeReport.learningRoadmap?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                        {activeReport.learningRoadmap.map((item, index) => (
                            <li key={index}>
                                <strong>{item.skill || item}</strong>
                                {item.priority && (
                                    <span className="ml-2 text-xs uppercase px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                                        {item.priority} priority
                                    </span>
                                )}
                                {item.reason && <p className="text-xs text-gray-400 ml-5">{item.reason}</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-xs">No learning roadmap provided.</p>
                )}
            </div>

            {/* 9. TECHNICAL QUESTIONS */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">
                    Technical Questions ({activeReport.technicalQuestions?.length || 0})
                </h3>
                {activeReport.technicalQuestions?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-3 text-sm text-gray-300">
                        {activeReport.technicalQuestions.map((q, index) => (
                            <li key={index}>
                                <strong>{q.question || q}</strong>
                                {q.intention && (
                                    <p className="text-xs text-gray-400 ml-5">
                                        <em>Intention:</em> {q.intention}
                                    </p>
                                )}
                                {q.answer && (
                                    <p className="text-xs text-gray-300 ml-5 bg-black/20 p-1.5 rounded mt-1">
                                        <em>Suggested Answer:</em> {q.answer}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-xs">No technical questions generated.</p>
                )}
            </div>

            {/* 10. BEHAVIORAL QUESTIONS */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-pink-400 mb-2">
                    Behavioral Questions ({activeReport.behavioralQuestions?.length || 0})
                </h3>
                {activeReport.behavioralQuestions?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-3 text-sm text-gray-300">
                        {activeReport.behavioralQuestions.map((q, index) => (
                            <li key={index}>
                                <strong>{q.question || q}</strong>
                                {q.intention && (
                                    <p className="text-xs text-gray-400 ml-5">
                                        <em>Intention:</em> {q.intention}
                                    </p>
                                )}
                                {q.answer && (
                                    <p className="text-xs text-gray-300 ml-5 bg-black/20 p-1.5 rounded mt-1">
                                        <em>Suggested Answer:</em> {q.answer}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-xs">No behavioral questions generated.</p>
                )}
            </div>

            {/* 11. SUBMITTED INPUT DATA (COLLAPSIBLE / SUMMARY DETAILS) */}
            <details className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-400 cursor-pointer">
                <summary className="font-semibold text-gray-300 mb-2">View Submitted Input Context</summary>
                <div className="space-y-3 mt-3 pt-3 border-t border-white/10">
                    <div>
                        <span className="font-semibold text-gray-300 block mb-1">Target Job Description:</span>
                        <p className="bg-black/30 p-2 rounded text-gray-400 whitespace-pre-wrap">
                            {activeReport.jobDescription || "N/A"}
                        </p>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-300 block mb-1">Resume Text:</span>
                        <p className="bg-black/30 p-2 rounded text-gray-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {activeReport.resumeText || "N/A"}
                        </p>
                    </div>
                    {activeReport.selfDescription && (
                        <div>
                            <span className="font-semibold text-gray-300 block mb-1">Self Description:</span>
                            <p className="bg-black/30 p-2 rounded text-gray-400 whitespace-pre-wrap">
                                {activeReport.selfDescription}
                            </p>
                        </div>
                    )}
                </div>
            </details>
        </div>
    );
}