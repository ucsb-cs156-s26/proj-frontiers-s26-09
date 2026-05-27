import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CourseWarningBanner } from "main/components/Courses/CourseWarningBanner";
import * as useBackend from "main/utils/useBackend";

const axiosMock = new AxiosMockAdapter(axios);
const queryClient = new QueryClient();
describe("CourseWarningBanner tests", () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    queryClient.clear();
  });

  test("renders warning banner on warning return", async () => {
    vi.spyOn(useBackend, "useBackend");
    axiosMock
      .onGet("/api/courses/warnings/1")
      .reply(200, { showOrganizationAgeWarning: true });
    render(
      <QueryClientProvider client={queryClient}>
        <CourseWarningBanner courseId={1} />
      </QueryClientProvider>,
    );
    await screen.findByText(/This GitHub Organization/i);
    expect(useBackend.useBackend).toHaveBeenCalledWith(
      [`/api/courses/warnings/1`],
      {
        method: "GET",
        url: `/api/courses/warnings/1`,
      },
      undefined,
      true,
      {
        placeholderData: {
          showOrganizationAgeWarning: false,
          showDefaultBasePermissions: false,
        },
        staleTime: "static",
      },
    );
  });

  test("renders default base permission warning with link and hides after post", async () => {
    axiosMock.onGet("/api/courses/warnings/1").reply(200, {
      showDefaultBasePermissions: true,
    });
    axiosMock
      .onPost("/api/courses/warnings/hideBasePermissionWarning/1")
      .reply(200, {
        message: "hideBasePermissionWarning set to true for course with id 1",
      });

    render(
      <QueryClientProvider client={queryClient}>
        <CourseWarningBanner courseId={1} orgName="ucsb-cs156-s26" />
      </QueryClientProvider>,
    );

    await screen.findByText(/Default Base Permission/i);
    expect(
      screen.getByRole("link", {
        name: /You can change that setting here/i,
      }),
    ).toHaveAttribute(
      "href",
      "https://github.com/organizations/ucsb-cs156-s26/settings/member_privileges",
    );

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));

    await waitFor(() => {
      expect(axiosMock.history.post).toHaveLength(1);
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/Default Base Permission/i),
      ).not.toBeInTheDocument();
    });
  });

  test("Does not render banner on false", async () => {
    vi.spyOn(useBackend, "useBackend");
    axiosMock.onGet("/api/courses/warnings/1").reply(200, {
      showOrganizationAgeWarning: false,
      showDefaultBasePermissions: false,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <CourseWarningBanner courseId={1} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(useBackend.useBackend).toBeCalled();
    });
    expect(
      screen.queryByText(/This GitHub Organization/i),
    ).not.toBeInTheDocument();
  });
  test("No misbehavior on empty return", async () => {
    vi.spyOn(useBackend, "useBackend");
    axiosMock.onGet("/api/courses/warnings/1").reply(200, {});
    render(
      <QueryClientProvider client={queryClient}>
        <CourseWarningBanner courseId={1} />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(useBackend.useBackend).toBeCalled();
    });
    expect(
      screen.queryByText(/This GitHub Organization/i),
    ).not.toBeInTheDocument();
  });
});
