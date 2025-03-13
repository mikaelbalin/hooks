import { act, renderHook } from "@testing-library/react";
import { useDisclosure } from "./use-disclosure";

describe("use-disclosure", () => {
  it("handles close correctly", () => {
    const hook = renderHook(() => useDisclosure(true));
    expect(hook.result.current[0]).toBe(true);

    act(() => hook.result.current[1].close());
    expect(hook.result.current[0]).toBe(false);
  });

  it("handles open correctly", () => {
    const hook = renderHook(() => useDisclosure(false));
    expect(hook.result.current[0]).toBe(false);

    act(() => hook.result.current[1].open());
    expect(hook.result.current[0]).toBe(true);
  });

  it("handles toggle correctly", () => {
    const hook = renderHook(() => useDisclosure(false));
    expect(hook.result.current[0]).toBe(false);

    act(() => hook.result.current[1].toggle());
    expect(hook.result.current[0]).toBe(true);

    act(() => hook.result.current[1].toggle());
    expect(hook.result.current[0]).toBe(false);
  });
});
