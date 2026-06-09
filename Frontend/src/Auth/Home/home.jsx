import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Sparkles } from "lucide-react";

const Home = () => {
  const [selfDesc, setSelfDesc] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const handleProcess = async () => {
    setLoading(true);
    setOutput(null);

    // mock AI delay
    setTimeout(() => {
      setOutput({
        match: "87%",
        summary:
          "Your profile matches strongly with the job role. Your skills align well with backend development and system design.",
        strengths: ["React", "Node.js", "Problem Solving"],
        improvements: ["Add more system design projects", "Improve DevOps basics"],
      });

      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1023] text-white flex flex-col items-center px-4 py-10">

 {/* Title */}
{/* Title */}
<h1 className="text-3xl md:text-4xl font-bold !text-white mb-2 text-center">
  AI Career Analyzer
</h1>

<p className="!text-white mb-10 text-center max-w-xl">
  Upload your profile, resume and job description to get AI insights
</p>

{/* INPUT CONTAINER */}
<div className="w-full max-w-2xl bg-black/40 border border-cyan-400/20 rounded-2xl backdrop-blur-lg p-6 space-y-6 shadow-[0_0_30px_rgba(0,212,255,0.15)]">

  {/* Self Description */}
  <div>
    <label className="!text-white text-sm mb-2 block">
      Self Description
    </label>

    <textarea
      className="w-full h-32 bg-transparent border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-400 transition !text-white placeholder:!text-white/50"
      placeholder="Write about yourself..."
      value={selfDesc}
      onChange={(e) => setSelfDesc(e.target.value)}
    />
  </div>

  {/* Resume Upload */}
  <div className="flex flex-col items-center justify-center border border-white/10 rounded-xl p-6">
    <label className="!text-white text-sm mb-3">
      Upload Resume
    </label>

    <input
      type="file"
      id="resume"
      className="hidden"
      onChange={(e) => setResume(e.target.files[0])}
    />

    <label
      htmlFor="resume"
      className="px-5 py-3 bg-cyan-500 !text-white rounded-lg cursor-pointer hover:shadow-[0_0_20px_cyan] transition"
    >
      Choose File
    </label>

    {resume && (
      <p className="!text-white text-sm mt-3">
        📄 {resume.name}
      </p>
    )}
  </div>

  {/* Job Description */}
  <div>
    <label className="!text-white text-sm mb-2 block">
      Job Description
    </label>

    <textarea
      className="w-full h-32 bg-transparent border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-400 transition !text-white placeholder:!text-white/50"
      placeholder="Paste job description..."
      value={jobDesc}
      onChange={(e) => setJobDesc(e.target.value)}
    />
  </div>

</div>

  {/* BUTTON */}
  <button
    onClick={handleProcess}
    disabled={loading}
    className="mt-8 px-8 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_25px_cyan] transition"
  >
    {loading ? "Analyzing..." : "Analyze with AI"}
  </button>

  {/* OUTPUT */}
 {output && (
  <div
    className="mt-10 w-full max-w-2xl bg-white/5 border border-cyan-400/20 rounded-2xl p-6 backdrop-blur-lg"
    style={{ color: "#ffffff" }}
  >

    <h2 className="text-xl font-bold text-center mb-4" style={{ color: "#ffffff" }}>
      AI Result
    </h2>

    <p className="text-center mb-6 leading-relaxed" style={{ color: "#ffffff" }}>
      {output.summary}
    </p>

    <div className="text-center mb-6">
      <span style={{ color: "#ffffff" }}>Match Score:</span>{" "}
      <span className="font-bold text-2xl" style={{ color: "#ffffff" }}>
        {output.match}
      </span>
    </div>

    <div className="grid md:grid-cols-2 gap-4">

      <div className="bg-black/20 p-4 rounded-lg">
        <h3 className="mb-2 font-semibold" style={{ color: "#ffffff" }}>
          Strengths
        </h3>
        <ul className="list-disc ml-5 space-y-1">
          {output.strengths.map((s, i) => (
            <li key={i} style={{ color: "#ffffff" }}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-black/20 p-4 rounded-lg">
        <h3 className="mb-2 font-semibold" style={{ color: "#ffffff" }}>
          Improvements
        </h3>
        <ul className="list-disc ml-5 space-y-1">
          {output.improvements.map((s, i) => (
            <li key={i} style={{ color: "#ffffff" }}>
              {s}
            </li>
          ))}
        </ul>
      </div>

    </div>

  </div>
)}

</div>
  );
};

export default Home;