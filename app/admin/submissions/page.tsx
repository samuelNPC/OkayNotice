"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, FileText, User } from "lucide-react";

export default function AdminSubmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Security Check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  // Fetch pending submissions from Cloudflare API
  const fetchSubmissions = async () => {
    try {
      const res = await fetch("https://api.etomu.com/api/admin/submissions", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSubmissions();
  }, [user]);

  // Approve Submission (Publishes live to main feed)
  const handleApprove = async (id: string) => {
    setActionId(id);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch(`https://api.etomu.com/api/admin/submissions/${id}/approve`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Approval failed");

      setSubmissions(submissions.filter(sub => sub.id !== id));
      setMessage({ type: "success", text: "Submission approved and published live!" });
    } catch (error) {
      alert("Failed to approve submission.");
    } finally {
      setActionId(null);
    }
  };

  // Reject Submission
  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject and discard this submission?")) return;

    setActionId(id);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch(`https://api.etomu.com/api/admin/submissions/${id}/reject`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Rejection failed");

      setSubmissions(submissions.filter(sub => sub.id !== id));
      setMessage({ type: "success", text: "Submission rejected." });
    } catch (error) {
      alert("Failed to reject submission.");
    } finally {
      setActionId(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Editorial Review Queue</h1>
            <p className="text-sm text-slate-500">Review pending career and contributor stories submitted by the community.</p>
          </div>
        </div>
      </div>

      {message.text && (
        <div className="mb-6 p-4 rounded-xl border bg-green-50 border-green-100 text-green-700 font-medium text-sm">
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-blue-600"><Loader2 className="animate-spin w-6 h-6" /></div>
        ) : submissions.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
            <FileText size={40} className="stroke-1" />
            <p className="font-medium text-slate-600">No pending submissions right now.</p>
            <p className="text-xs">Incoming contributor pitches will appear here for your review.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/50 transition">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-md">
                      {sub.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Submitted {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{sub.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{sub.excerpt}</p>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
                    <User size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">{sub.author}</span>
                    <span className="text-slate-300">•</span>
                    <span>{sub.authorEmail}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end shrink-0">
                  <button 
                    onClick={() => handleReject(sub.id)}
                    disabled={actionId === sub.id}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>

                  <button 
                    onClick={() => handleApprove(sub.id)}
                    disabled={actionId === sub.id}
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm disabled:bg-blue-400"
                  >
                    {actionId === sub.id ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Approve & Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
