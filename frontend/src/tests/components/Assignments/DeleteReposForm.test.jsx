import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeleteReposForm from "main/components/Assignments/DeleteReposForm";
import { vi } from "vitest";

describe("DeleteReposForm tests", () => {
  test("renders correctly", async () => {
    render(<DeleteReposForm submitAction={vi.fn()} />);

    expect(screen.getByLabelText("Repository Prefix")).toBeInTheDocument();
    expect(screen.getByTestId("DeleteReposForm-submit")).toHaveTextContent(
      "Delete Empty Matching Repos",
    );
  });

  test("requires repo prefix", async () => {
    render(<DeleteReposForm submitAction={vi.fn()} />);

    fireEvent.click(screen.getByTestId("DeleteReposForm-submit"));

    await waitFor(() =>
      expect(
        screen.getByText("Repository Prefix is required."),
      ).toBeInTheDocument(),
    );
  });
});
