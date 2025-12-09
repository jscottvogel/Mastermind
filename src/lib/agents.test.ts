import { AGENTS } from "./agents";

describe("AGENTS configuration", () => {
    it("should have at least one agent", () => {
        expect(AGENTS.length).toBeGreaterThan(0);
    });

    it("should have unique IDs for all agents", () => {
        const ids = AGENTS.map((agent) => agent.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have required properties for each agent", () => {
        AGENTS.forEach((agent) => {
            expect(agent.id).toBeDefined();
            expect(agent.name).toBeDefined();
            expect(agent.role).toBeDefined();
            expect(agent.systemPrompt).toBeDefined();
            expect(agent.avatar).toBeDefined();
        });
    });
});
