import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFakeStrategy } from "./fakeStrategy";

const DURATION = 1000;
/** One tick past the deadline: the interval only settles on the tick that
 * observes the elapsed time, and 1000 is not a multiple of its 120ms period. */
const PAST_DEADLINE = DURATION + 120;

const upload = (
  strategy: ReturnType<typeof createFakeStrategy>,
  signal: AbortSignal,
  onProgress: (percent: number) => void = () => undefined,
) =>
  strategy(
    new File(["x"], "invoice.png", { type: "image/png" }),
    "demo",
    "e1",
    {
      onProgress,
      signal,
    },
  );

describe("createFakeStrategy", () => {
  let controller: AbortController;

  beforeEach(() => {
    // Fake timers keep the simulated 1.6s transport instant and deterministic:
    // the interval and the `Date.now()` it measures against advance together.
    vi.useFakeTimers();
    controller = new AbortController();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fails the first attempt and succeeds on the retry", async () => {
    // What RetryCase demonstrates. The count is per file name, so a retry of
    // the same file is attempt 2 — not a fresh upload.
    const strategy = createFakeStrategy({ duration: DURATION, failTimes: 1 });

    const first = upload(strategy, controller.signal).catch(
      (error: Error) => error,
    );
    await vi.advanceTimersByTimeAsync(PAST_DEADLINE);
    expect(((await first) as Error).message).toBe("Network failed (attempt 1)");

    const second = upload(strategy, controller.signal);
    await vi.advanceTimersByTimeAsync(PAST_DEADLINE);
    await expect(second).resolves.toMatchObject({
      fileName: "invoice.png",
      scope: "demo",
      entityId: "e1",
    });
  });

  it("rejects every attempt when the transport is set to fail", async () => {
    const strategy = createFakeStrategy({
      duration: DURATION,
      failWith: "Storage unavailable",
    });

    const result = upload(strategy, controller.signal).catch(
      (error: Error) => error,
    );
    await vi.advanceTimersByTimeAsync(PAST_DEADLINE);

    expect(((await result) as Error).message).toBe("Storage unavailable");
  });

  it("rejects with an AbortError when cancelled mid-flight", async () => {
    // The uploader distinguishes a cancel from a failure by `name`; a plain
    // Error here would surface to the user as a broken upload.
    const strategy = createFakeStrategy({ duration: DURATION });

    const result = upload(strategy, controller.signal).catch(
      (error: Error) => error,
    );
    await vi.advanceTimersByTimeAsync(240);
    controller.abort();

    expect(((await result) as Error).name).toBe("AbortError");
  });

  it("never reports 100 percent before the file is stored", async () => {
    // 100 means "done" to the hook; the transport must leave that to the
    // resolve, or the UI shows a completed upload that has not landed.
    const seen: number[] = [];
    const strategy = createFakeStrategy({ duration: DURATION });

    const result = upload(strategy, controller.signal, (p) => seen.push(p));
    await vi.advanceTimersByTimeAsync(PAST_DEADLINE);
    await result;

    expect(seen.length).toBeGreaterThan(0);
    expect(Math.max(...seen)).toBeLessThanOrEqual(99);
  });
});
