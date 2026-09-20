// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InstallCommand } from "./InstallCommand";

afterEach(cleanup);

describe("InstallCommand", () => {
  it("shows the npm command first", () => {
    render(<InstallCommand locale="en" pkg="listkit" />);
    expect(screen.getByText("npm install listkit")).toBeDefined();
  });

  it("switches the command when another manager is picked", async () => {
    render(<InstallCommand locale="en" pkg="listkit" />);
    await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(screen.getByText("pnpm add listkit")).toBeDefined();
    expect(screen.queryByText("npm install listkit")).toBeNull();
  });

  it("keeps each block's choice independent", async () => {
    // The regression: a shared Fumadocs `groupId` synced every block on the
    // page, so picking pnpm for one package switched the other too.
    render(
      <>
        <InstallCommand locale="en" pkg="listkit" />
        <InstallCommand locale="en" pkg="uploaderkit" />
      </>,
    );
    const [firstPnpm] = screen.getAllByRole("tab", { name: "pnpm" });
    await userEvent.click(firstPnpm!);

    expect(screen.getByText("pnpm add listkit")).toBeDefined();
    expect(screen.getByText("npm install uploaderkit")).toBeDefined();
  });

  it("marks only the active manager as selected", async () => {
    render(<InstallCommand locale="en" pkg="listkit" />);
    await userEvent.click(screen.getByRole("tab", { name: "yarn" }));
    const selected = screen
      .getAllByRole("tab")
      .filter((tab) => tab.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
    expect(selected[0]!.textContent).toBe("yarn");
  });

  it("copies the command currently shown", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<InstallCommand locale="en" pkg="uploaderkit" />);
    await userEvent.click(screen.getByRole("tab", { name: "bun" }));
    await userEvent.click(screen.getByRole("button", { name: /copy/i }));

    expect(writeText).toHaveBeenCalledWith("bun add uploaderkit");
  });
});
