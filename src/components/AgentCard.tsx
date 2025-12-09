import { Agent } from "@/lib/agents";
import { Smile, Frown, Meh } from "lucide-react";
import clsx from "clsx";

interface AgentResult {
    sentiment: "SATISFIED" | "NEUTRAL" | "UNSATISFIED";
    suggestions: string[];
    summary: string;
}

interface AgentCardProps {
    agent: Agent;
    result?: AgentResult;
}

/**
 * AgentCard displays the analysis result for a single agent.
 * It shows the agent's identity, sentiment analysis, summary, and suggestions.
 */
export function AgentCard({ agent, result }: AgentCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            {/* Header Section */}
            <div className={clsx("p-4 flex items-center gap-3 border-b border-slate-100", agent.color)}>
                <div className="text-2xl" role="img" aria-label={`${agent.name} avatar`}>
                    {agent.avatar}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{agent.name}</h3>
                    <p className="text-xs text-slate-600 opacity-80">{agent.role}</p>
                </div>
                <div className="ml-auto">
                    {result && (
                        <div title={`Sentiment: ${result.sentiment}`} data-testid="sentiment-icon">
                            {result.sentiment === "SATISFIED" && <Smile className="w-6 h-6 text-green-600" />}
                            {result.sentiment === "NEUTRAL" && <Meh className="w-6 h-6 text-yellow-600" />}
                            {result.sentiment === "UNSATISFIED" && <Frown className="w-6 h-6 text-red-600" />}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
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
}
