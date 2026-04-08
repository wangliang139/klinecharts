import { describe, expect, it, vi } from "vitest";

import { createResyncScheduler } from "../tradingEffects";

describe("tradingEffects scheduler", () => {
  it("runs only latest batch when rescheduled", () => {
    vi.useFakeTimers();
    const sync = vi.fn();
    const scheduler = createResyncScheduler(sync, [0, 100]);
    scheduler.schedule();
    scheduler.schedule();
    vi.runAllTimers();
    expect(sync).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
