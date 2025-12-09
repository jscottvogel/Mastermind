import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { Agent } from "./agents";

const AnalysisSchema = z.object({
    sentiment: z.enum(["SATISFIED", "NEUTRAL", "UNSATISFIED"]),
    suggestions: z.array(z.string()).describe("List of 1-3 specific suggestions"),
    summary: z.string().describe("A one sentence summary of the agent's thoughts"),
});

export type AgentAnalysis = z.infer<typeof AnalysisSchema>;

export async function analyzeDocumentWithAgent(docContent: string, agent: Agent): Promise<AgentAnalysis> {
    // If the document is empty, return a default state
    if (!docContent || docContent.trim().length === 0) {
        return {
            sentiment: "NEUTRAL",
            suggestions: ["Start typing to get feedback!"],
            summary: "Waiting for content..."
        };
    }

    try {
        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            system: agent.systemPrompt,
            prompt: `Analyze the following document content:\n\n${docContent}`,
            schema: AnalysisSchema,
        });

        return object;
    } catch (error) {
        console.error(`Error analyzing with agent ${agent.name}:`, error);
        return {
            sentiment: "NEUTRAL",
            suggestions: ["Brain freeze! I couldn't analyze that."],
            summary: "Error during analysis."
        };
    }
}
