import React, { useState } from "react";

export default function HomePage() {
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const history = [
    { id: 1, title: "AI Chat System" },
    { id: 2, title: "Database Design Help" },
    { id: 3, title: "React UI Fixing" },
  ];

  const [form, setForm] = useState({
    f1: "",
    f2: "",
    f3: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="h-screen w-full flex flex-col bg-[#0b0f1a] text-white overflow-hidden">

      {/* TOP HEADER */}
      <div className="w-full px-6 py-3 bg-white/5 border-b border-white/10 backdrop-blur-xl">
        <h1 className="text-xl font-bold tracking-wide text-blue-400">
          AI Resume Analyzer
        </h1>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR */}
        <div
          className={`transition-all duration-300 
          ${sidebarOpen ? "w-72" : "w-20"}
          bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col`}
        >

          {/* SIDEBAR TOP */}
          <div className="p-4 flex items-center justify-between">
            <h1 className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}>
              History
            </h1>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xs bg-white/10 px-2 py-1 rounded"
            >
              {sidebarOpen ? "⟨" : "⟩"}
            </button>
          </div>

          {/* HISTORY LIST */}
          <div className="flex-1 overflow-y-auto px-2 space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => setActiveChat(h)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center
                  ${
                    activeChat?.id === h.id
                      ? "bg-blue-600/30 border border-blue-500 text-blue-300"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
              >
                <span>{sidebarOpen ? h.title : "💬"}</span>

                {activeChat?.id === h.id && (
                  <span className="ml-auto text-blue-400">●</span>
                )}
              </div>
            ))}
          </div>

          {/* SIDEBAR BOTTOM */}
          <div className="p-3 space-y-2">
            <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
              Settings
            </button>
            <button className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500">
              Logout
            </button>
            <button className="w-full py-2 rounded-lg bg-red-800 hover:bg-red-700 text-sm">
              Logout All Devices
            </button>
          </div>
        </div>

        {/* CENTER CHAT AREA */}
        <div className="flex-1 flex flex-col p-6">

          {/* HEADER */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              {"AI Resume Analyzer"}
            </h2>
          </div>

          {/* CHAT WINDOW */}
          <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-5 overflow-y-auto shadow-lg">
            {activeChat ? (
              <div className="text-gray-300">
                <p>Welcome to: {activeChat.title}</p>
                <p className="mt-2 text-sm text-gray-500">
                  (Chat messages will appear here)
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No chat selected</p>
            )}
          </div>

          {/* INPUT FIELDS */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <input
              name="f1"
              value={form.f1}
              onChange={handleChange}
              placeholder="Message 1"
              className="p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
            />
            <input
              name="f2"
              value={form.f2}
              onChange={handleChange}
              placeholder="Message 2"
              className="p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
            />
            <input
              name="f3"
              value={form.f3}
              onChange={handleChange}
              placeholder="Message 3"
              className="p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* RIGHT DASHBOARD */}
        <div className="w-80 p-5 bg-white/5 backdrop-blur-xl border-l border-white/10">

          {/* USER CARD */}
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/100?img=5"
              className="w-14 h-14 rounded-full border border-white/20"
              alt="user"
            />
            <div>
              <h2 className="font-semibold">Juel Rana</h2>
              <p className="text-sm text-gray-400">CSE Student</p>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/20">
              ⚡ Total Chats: 24
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-600/30 to-blue-600/20">
              📊 Active Sessions: 3
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-pink-600/30 to-purple-600/20">
              🚀 Performance: 92%
            </div>
          </div>

          {/* TIP CARD */}
          <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/10">
            <p className="text-sm text-gray-300">
              💡 Tip: Analyze resumes to get better job recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}