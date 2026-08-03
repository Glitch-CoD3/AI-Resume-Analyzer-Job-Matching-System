import React from "react";

export default function AnalysisForm({ form, handleChange, handleSubmit, isSubmitting }) {
  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      {/* INPUTS GRID */}
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

      {/* RIGHT-ALIGNED SUBMIT BUTTON */}
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
  );
}