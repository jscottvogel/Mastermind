"use client";

import { Agent, AGENTS } from "@/lib/agents";
import { analyzeSession } from "@/app/actions";
import { useState, useEffect, useCallback } from "react";
import { ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import clsx from "clsx";
import { AgentSelector } from "./AgentSelector";
import { AgentCard } from "./AgentCard";

interface SessionViewProps {
    docId: string;
}

interface AgentResult {
    sentiment: "SATISFIED" | "NEUTRAL" | "UNSATISFIED";
    suggestions: string[];
    summary: string;
}

export function SessionView({ docId }: SessionViewProps) {
    const [activeAgents, setActiveAgents] = useState<Agent[]>(AGENTS);
    const [results, setResults] = useState<Record<string, AgentResult>>({});
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchAnalysis = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await analyzeSession(
                docId,
                activeAgents.map((a) => a.id)
            );
            if (resp.success && resp.results) {
                setResults(resp.results);
                setLastUpdated(new Date());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [docId, activeAgents]);

    useEffect(() => {
        fetchAnalysis();
        const interval = setInterval(fetchAnalysis, 30000);
        return () => clearInterval(interval);
    }, [fetchAnalysis]);

    const handleToggleAgent = (agent: Agent) => {
        setActiveAgents((prev) =>
            prev.find((a) => a.id === agent.id)
                ? prev.filter((a) => a.id !== agent.id)
                : [...prev, agent]
        );
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h1 className="font-bold text-slate-800">Mastermind Session</h1>
                </div>
                <div className="flex items-center gap-4">
                    {lastUpdated && (
                        <span className="text-xs text-slate-400 hidden md:block">
                            Updated {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <a
                        href={`https://docs.google.com/document/d/${docId}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        Open Google Doc <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Agents Panel */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Agent Feedback</h2>
                            <p className="text-slate-500 text-sm">Real-time analysis from your expert team.</p>
                        </div>
                        <div className="flex gap-2">
                            <AgentSelector
                                allAgents={AGENTS}
                                activeAgents={activeAgents}
                                onToggleAgent={handleToggleAgent}
                            />

                            <button
                                onClick={fetchAnalysis}
                                disabled={loading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
                                {loading ? "Analyzing..." : "Refresh"}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {activeAgents.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-dashed border-slate-300 rounded-xl">
                                Select an agent to see their feedback.
                            </div>
                        )}
                        {activeAgents.map((agent) => (
                            <AgentCard
                                key={agent.id}
                                agent={agent}
                                result={results[agent.id]}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
