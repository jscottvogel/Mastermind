import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { SessionView } from "./SessionView";
import { analyzeSession } from "@/app/actions";
import { AGENTS } from "@/lib/agents";

// Mock the server action
jest.mock("@/app/actions", () => ({
    analyzeSession: jest.fn(),
}));

// Mock Lucide icons to avoid render issues (optional but good for snapshots usually, though here we just checking presence)
// Actually standard rendering is fine for functional tests usually.

describe("SessionView", () => {
    const mockDocId = "test-doc-id";
    const mockAnalyzeSession = analyzeSession as jest.Mock;

    beforeEach(() => {
        mockAnalyzeSession.mockReset();
        // Default mock implementation
        mockAnalyzeSession.mockResolvedValue({
            success: true,
            results: {
                critic: {
                    sentiment: "SATISFIED",
                    suggestions: ["Good job"],
                    summary: "Well done"
                }
            }
        });
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("renders the header and agent selector", () => {
        render(<SessionView docId={mockDocId} />);

        expect(screen.getByText("Mastermind Session")).toBeInTheDocument();
        expect(screen.getByText(/Agents \(/)).toBeInTheDocument();
        // Agent name appears in selector and in the card
        expect(screen.getAllByText("Dr. Critical").length).toBeGreaterThan(0);
    });

    it("fetches analysis on mount", async () => {
        render(<SessionView docId={mockDocId} />);

        await waitFor(() => {
            expect(mockAnalyzeSession).toHaveBeenCalled();
        });

        // Check if called with docId and all agent IDs (default)
        expect(mockAnalyzeSession).toHaveBeenCalledWith(
            mockDocId,
            expect.arrayContaining(AGENTS.map(a => a.id))
        );
    });

    it("displays analysis results", async () => {
        render(<SessionView docId={mockDocId} />);

        await waitFor(() => {
            expect(screen.getByText('"Well done"')).toBeInTheDocument();
            expect(screen.getByText("Good job")).toBeInTheDocument();
        });
    });

    it("toggles agents", async () => {
        render(<SessionView docId={mockDocId} />);

        // Find the button to toggle agents dropdown (it's the 'Agents (3)' button likely)
        // Wait, the dropdown is hover based in the implementation? 
        // "group-hover:block"
        // Testing hover states in JSDOM can be tricky if we rely on CSS display:none.
        // However, the elements might technically be in the DOM just hidden if it's CSS hover.
        // Let's check the implementation of AgentSelector.
        // It renders the list always but hides it with CSS? 
        // Yes: "hidden group-hover:block".
        // React Testing Library usually sees "hidden" elements as not visible.

        // We can just click the agent item if we can access it.
        // Let's try to query by text directly. Since JSDOM doesn't fully compute CSS layout for hover in the same way, 
        // sometimes hidden elements are accessible unless explicitly checked for visibility.
        // But usually to interact we might need to simulate hover if we were stricter.
        // For now, let's assume we can click the agent name.

        // Use data-testid to select the specific item in the dropdown
        const criticItem = screen.getByTestId(`agent-selector-item-critic`);

        // Initial state: active. Click to deactivate.
        fireEvent.click(criticItem);

        // Refresh analysis should now be called with one less agent on next interval or manual refresh?
        // The component calls analyzeSession on mount/interval based on `activeAgents` state?
        // Implementation:
        // useEffect(() => { fetchAnalysis(); ... }, [fetchAnalysis]);
        // fetchAnalysis depends on [docId, activeAgents].
        // So changing activeAgents triggers fetchAnalysis immediately because of dependency array in useCallback?
        // Let's check SessionView.tsx:
        // useCallback(..., [docId, activeAgents])
        // useEffect(..., [fetchAnalysis])
        // Yes, changing activeAgents creates a new fetchAnalysis function, which triggers useEffect.

        await waitFor(() => {
            // Should be called again.
            // First call was on mount. Second call after update.
            expect(mockAnalyzeSession).toHaveBeenCalledTimes(2);
        });

        // The second call should NOT have 'critic' in the list.
        const lastCallArgs = mockAnalyzeSession.mock.calls[1];
        const agentsList = lastCallArgs[1];
        expect(agentsList).not.toContain("critic");
    });
});
