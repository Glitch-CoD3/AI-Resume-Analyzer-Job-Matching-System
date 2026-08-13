import React, { useRef } from "react";
import AxiosInstance from "../api/axiosInstance.jsx";

export default function RightPanel({ user, totalReports, activeSessionsCount }) {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await AxiosInstance.put(
        "/dashboard/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
    }
  };

  return (
    <div className="w-80 h-full p-6 bg-gradient-to-b from-slate-900/70 via-slate-800/60 to-slate-900/70 backdrop-blur-2xl border-l border-white/10 flex flex-col justify-between">
      <div>
        {/* USER CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6">
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            {/* HIDDEN FILE INPUT (ADDED HERE) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={handleAvatarClick}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-400 animate-spin [animation-duration:8s]"></div>

              <div className="relative p-1 rounded-full bg-slate-900">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`
                  }
                  className="w-24 h-24 rounded-full object-cover"
                  alt="Avatar"
                />
              </div>

              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-4 border-slate-900 animate-pulse"></div>

              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-sm">
                  📷 Change
                </div>
              </div>
            </div>

            <h2 className="mt-4 text-lg font-bold text-white truncate w-full">
              {user.username}
            </h2>

            <p className="text-sm text-slate-400 truncate w-full">
              {user.email}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 p-5 hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-300">
                  Reports
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {totalReports}
                </h3>
              </div>

              <div className="text-3xl">📄</div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600/20 to-blue-600/10 p-5 hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-300">
                  Active Sessions
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {activeSessionsCount}
                </h3>
              </div>

              <div className="text-3xl">⚡</div>
            </div>
          </div>
        </div>
      </div>

      {/* TIP CARD */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-lg">
            💡
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1">Quick Tip</h4>

            <p className="text-sm leading-6 text-slate-300">
              Click on previous reports from the history panel to instantly
              revisit old AI analyses without submitting another document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}