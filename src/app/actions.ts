"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createDocument, getDocument, extractTextFromDocument } from "@/lib/google";
import { redirect } from "next/navigation";

import { AGENTS } from "@/lib/agents";
import { analyzeDocumentWithAgent } from "@/lib/llm";

export async function createNewSession(title: string = "New Mastermind Session") {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        throw new Error("Not authenticated");
    }

    try {
        const doc = await createDocument(session.accessToken, title);
        // In a real app, we might save this session ID to a database to track active agents.
        return { success: true, docId: doc.documentId };
    } catch (error) {
        console.error("Failed to create document", error);
        return { success: false, error: "Failed to create document" };
    }
}

export async function fetchDocumentContent(docId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        throw new Error("Not authenticated");
    }

    try {
        const doc = await getDocument(session.accessToken, docId);
        const text = extractTextFromDocument(doc);
        return { success: true, text, title: doc.title };
    } catch (error) {
        return { success: false, error: "Failed to fetch document" };
    }
}

export async function analyzeSession(docId: string, activeAgentIds: string[]) {
    const { text } = await fetchDocumentContent(docId);

    if (!text) {
        return { success: false, error: "Could not retrieve document" };
    }

    const results: Record<string, any> = {};

    const promises = activeAgentIds.map(async (agentId) => {
        const agent = AGENTS.find((a) => a.id === agentId);
        if (!agent) return;

        const analysis = await analyzeDocumentWithAgent(text, agent);
        results[agentId] = analysis;
    });

    await Promise.all(promises);

    return { success: true, results };
}
