import axios from "axios";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import AssignmentTabComponent from "main/components/TabComponent/AssignmentTabComponent";
import AxiosMockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

const axiosMock = new AxiosMockAdapter(axios);
const mockToast = vi.fn();
beforeEach(() => {
  axiosMock.resetHistory();
});
vi.mock("react-toastify", async (importOriginal) => {
  return {
    ...(await importOriginal()),
    toast: (x) => mockToast(x),
  };
});

test("Calls individual repository assignment successfully", async () => {
  axiosMock.onPost("/api/repos/createRepos").reply(200);
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <AssignmentTabComponent courseId={7} />
    </QueryClientProvider>,
  );

  await screen.findByTestId("IndividualAssignmentForm-submit");
  fireEvent.change(screen.getByTestId("IndividualAssignmentForm-repoPrefix"), {
    target: { value: "test" },
  });
  fireEvent.click(screen.getByTestId("IndividualAssignmentForm-submit"));
  await waitFor(() => expect(mockToast).toHaveBeenCalled());
  expect(mockToast).toBeCalledWith("Repository creation successfully started.");
  expect(axiosMock.history.post.length).toEqual(1);
  expect(axiosMock.history.post[0].params).toEqual({
    courseId: 7,
    repoPrefix: "test",
    isPrivate: false,
    permissions: "MAINTAIN",
    creationOption: "STUDENTS_ONLY",
  });
});

test("Sends non-default creation option to backend", async () => {
  axiosMock.onPost("/api/repos/createRepos").reply(200);
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <AssignmentTabComponent courseId={7} />
    </QueryClientProvider>,
  );

  await screen.findByTestId("IndividualAssignmentForm-submit");

  fireEvent.change(screen.getByTestId("IndividualAssignmentForm-repoPrefix"), {
    target: { value: "test-non-default" },
  });

  fireEvent.change(
    screen.getByTestId("IndividualAssignmentForm-creationOption"),
    { target: { value: "STAFF_ONLY" } },
  );
  fireEvent.click(screen.getByTestId("IndividualAssignmentForm-submit"));
  await waitFor(() => expect(mockToast).toHaveBeenCalled());
  expect(axiosMock.history.post.length).toEqual(1);
  expect(axiosMock.history.post[0].params).toEqual({
    courseId: 7,
    repoPrefix: "test-non-default",
    isPrivate: false,
    permissions: "MAINTAIN",
    creationOption: "STAFF_ONLY",
  });
});

test("Calls team repository assignment successfully", async () => {
  axiosMock.onPost("/api/repos/createTeamRepos").reply(200);
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <AssignmentTabComponent courseId={7} />
    </QueryClientProvider>,
  );

  await screen.findByTestId("TeamRepositoryAssignmentForm-submit");
  fireEvent.change(
    screen.getByTestId("TeamRepositoryAssignmentForm-repoPrefix"),
    {
      target: { value: "test-team" },
    },
  );
  fireEvent.click(screen.getByTestId("TeamRepositoryAssignmentForm-submit"));
  await waitFor(() => expect(mockToast).toHaveBeenCalled());
  expect(mockToast).toBeCalledWith(
    "Team repository creation successfully started.",
  );
  expect(axiosMock.history.post.length).toEqual(1);
  expect(axiosMock.history.post[0].params).toEqual({
    courseId: 7,
    repoPrefix: "test-team",
    isPrivate: false,
    permissions: "MAINTAIN",
  });
});

test("Sends non-default team creation option to backend", async () => {
  axiosMock.onPost("/api/repos/createTeamRepos").reply(200);
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <AssignmentTabComponent courseId={7} />
    </QueryClientProvider>,
  );

  await screen.findByTestId("TeamRepositoryAssignmentForm-submit");

  fireEvent.change(
    screen.getByTestId("TeamRepositoryAssignmentForm-repoPrefix"),
    {
      target: { value: "test-team-non-default" },
    },
  );

  fireEvent.change(
    screen.getByTestId("TeamRepositoryAssignmentForm-permissions"),
    { target: { value: "ADMIN" } },
  );
  fireEvent.click(screen.getByTestId("TeamRepositoryAssignmentForm-submit"));
  await waitFor(() => expect(mockToast).toHaveBeenCalled());
  expect(axiosMock.history.post.length).toEqual(1);
  expect(axiosMock.history.post[0].params).toEqual({
    courseId: 7,
    repoPrefix: "test-team-non-default",
    isPrivate: false,
    permissions: "ADMIN",
  });
});

test("Calls delete repos job successfully", async () => {
  axiosMock.onDelete("/api/repos").reply(200);
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <AssignmentTabComponent courseId={7} />
    </QueryClientProvider>,
  );

  await screen.findByTestId("DeleteReposForm-submit");
  fireEvent.change(screen.getByTestId("DeleteReposForm-prefix"), {
    target: { value: "lab01" },
  });
  fireEvent.click(screen.getByTestId("DeleteReposForm-submit"));
  await waitFor(() => expect(mockToast).toHaveBeenCalled());
  expect(mockToast).toBeCalledWith(
    "Delete repositories job successfully started.",
  );
  expect(axiosMock.history.delete.length).toEqual(1);
  expect(axiosMock.history.delete[0].params).toEqual({
    courseId: 7,
    prefix: "lab01",
  });
});

test("Shows delete repos help text", async () => {
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <AssignmentTabComponent courseId={7} />
    </QueryClientProvider>,
  );

  expect(
    screen.getByText(
      "Delete all repos in the organization that have names starting with the prefix below and have no commits.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByTestId("DeleteRepos-help")).toBeInTheDocument();
});
