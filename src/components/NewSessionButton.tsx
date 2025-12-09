"use client";

import { createNewSession } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, ArrowRight, Loader2 } from "lucide-react";

export function NewSessionButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        try {
            const result = await createNewSession();
            if (result.success && result.docId) {
                router.push(`/session/${result.docId}`);
            } else {
                alert("Failed to create session");
            }
        } catch (e) {
            console.error(e);
            alert("Error creating session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={handleCreate}
            className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer text-left"
        >
            <div className="absolute top-6 right-6 p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                {loading ? (
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                ) : (
                    <FileText className="w-6 h-6 text-indigo-600" />
                )}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                New Document Session
            </h3>
            <p className="text-slate-500 mb-4">
                Create a new blank Google Doc and invite agents to join you.
            </p>
            <div className="text-indigo-600 font-medium flex items-center gap-1">
                Start new <ArrowRight className="w-4 h-4" />
            </div>
        </div>
    );
}
