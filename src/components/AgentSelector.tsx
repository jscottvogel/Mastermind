import { Agent } from "@/lib/agents";
import clsx from "clsx";

interface AgentSelectorProps {
    allAgents: Agent[];
    activeAgents: Agent[];
    onToggleAgent: (agent: Agent) => void;
}

/**
 * AgentSelector allows users to toggle which agents are active in the session.
 */
export function AgentSelector({ allAgents, activeAgents, onToggleAgent }: AgentSelectorProps) {
    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                Agents ({activeAgents.length})
            </button>
            {/* Dropdown for Agent Selection */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 p-2 hidden group-hover:block z-20">
                {allAgents.map((agent) => {
                    const isActive = activeAgents.some((a) => a.id === agent.id);
                    return (
                        <div
                            key={agent.id}
                            data-testid={`agent-selector-item-${agent.id}`}
                            className="flex items-center px-2 py-2 hover:bg-slate-50 rounded cursor-pointer gap-2"
                            onClick={() => onToggleAgent(agent)}
                        >
                            <div
                                className={clsx(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                    isActive ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"
                                )}
                            >
                                {isActive && <span className="text-white text-[10px] pb-0.5">✓</span>}
                            </div>
                            <span className="text-sm text-slate-700">{agent.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
