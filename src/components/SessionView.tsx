"use client";

import { Agent, AGENTS } from "@/lib/agents";
import { analyzeSession } from "@/app/actions";
import { useState, useEffect, useCallback } from "react";
import { ExternalLink, RefreshCw, Smile, Frown, Meh, Sparkles } from "lucide-react";
import clsx from "clsx";

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
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                                    Agents ({activeAgents.length})
                                </button>
                                {/* Simple Dropdown/Popover for Agent Selection */}
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 p-2 hidden group-hover:block z-20">
                                    {AGENTS.map(agent => (
                                        <div
                                            key={agent.id}
                                            className="flex items-center px-2 py-2 hover:bg-slate-50 rounded cursor-pointer gap-2"
                                            onClick={() => {
                                                setActiveAgents(prev =>
                                                    prev.find(a => a.id === agent.id)
                                                        ? prev.filter(a => a.id !== agent.id)
                                                        : [...prev, agent]
                                                )
                                            }}
                                        >
                                            <div className={clsx("w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                activeAgents.find(a => a.id === agent.id) ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"
                                            )}>
                                                {activeAgents.find(a => a.id === agent.id) && <span className="text-white text-[10px] pb-0.5">✓</span>}
                                            </div>
                                            <span className="text-sm text-slate-700">{agent.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                        {activeAgents.map((agent) => {
                            const result = results[agent.id];
                            return (
                                <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                                    <div className={clsx("p-4 flex items-center gap-3 border-b border-slate-100", agent.color)}>
                                        <div className="text-2xl">{agent.avatar}</div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{agent.name}</h3>
                                            <p className="text-xs text-slate-600 opacity-80">{agent.role}</p>
                                        </div>
                                        <div className="ml-auto">
                                            {result && (
                                                <div title={result.sentiment}>
                                                    {result.sentiment === "SATISFIED" && <Smile className="w-6 h-6 text-green-600" />}
                                                    {result.sentiment === "NEUTRAL" && <Meh className="w-6 h-6 text-yellow-600" />}
                                                    {result.sentiment === "UNSATISFIED" && <Frown className="w-6 h-6 text-red-600" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        {result ? (
                                            <div className="space-y-4">
                                                <p className="text-sm font-medium text-slate-800 italic">&quot;{result.summary}&quot;</p>

                                                {result.suggestions.length > 0 && (
                                                    <div className="space-y-2">
                                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggestions</h4>
                                                        <ul className="space-y-2">
                                                            {result.suggestions.map((s, i) => (
                                                                <li key={i} className="text-sm text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100">
                                                                    {s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8">
                                                <p className="text-sm">Waiting for content...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
