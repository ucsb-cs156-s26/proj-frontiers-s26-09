import IndividualAssignmentForm from "main/components/Assignments/IndividualAssignmentForm";
import TeamRepositoryAssignmentForm from "main/components/Assignments/TeamRepositoryAssignmentForm";
import DeleteReposForm from "main/components/Assignments/DeleteReposForm";
import { Card, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function AssignmentTabComponent({ courseId }) {
  const onSuccessAssignment = () => {
    toast("Repository creation successfully started.");
  };

  const onSuccessTeamAssignment = () => {
    toast("Team repository creation successfully started.");
  };

  const onSuccessDeleteRepos = () => {
    toast("Delete repositories job successfully started.");
  };

  const objectToAxiosParamsIndividualAssignment = (assignment) => ({
    url: `/api/repos/createRepos`,
    method: "POST",
    params: {
      courseId: courseId,
      repoPrefix: assignment.repoPrefix,
      isPrivate: assignment.assignmentPrivacy,
      permissions: assignment.permissions,
      creationOption: assignment.creationOption,
    },
  });

  const indvidiualAssignmentMutation = useBackendMutation(
    objectToAxiosParamsIndividualAssignment,
    { onSuccess: onSuccessAssignment },
  );

  const postIndividualAssignment = (assignment) => {
    indvidiualAssignmentMutation.mutate(assignment);
  };

  const objectToAxiosParamsTeamAssignment = (teamAssignment) => ({
    url: `/api/repos/createTeamRepos`,
    method: "POST",
    params: {
      courseId: courseId,
      repoPrefix: teamAssignment.repoPrefix,
      isPrivate: teamAssignment.assignmentPrivacy,
      permissions: teamAssignment.permissions,
    },
  });

  const teamAssignmentMutation = useBackendMutation(
    objectToAxiosParamsTeamAssignment,
    { onSuccess: onSuccessTeamAssignment },
  );

  const postTeamAssignment = (teamAssignment) => {
    teamAssignmentMutation.mutate(teamAssignment);
  };

  const objectToAxiosParamsDeleteRepos = (deleteReposRequest) => ({
    url: `/api/repos`,
    method: "DELETE",
    params: {
      courseId: courseId,
      prefix: deleteReposRequest.prefix,
    },
  });

  const deleteReposMutation = useBackendMutation(
    objectToAxiosParamsDeleteRepos,
    {
      onSuccess: onSuccessDeleteRepos,
    },
  );

  const postDeleteRepos = (deleteReposRequest) => {
    deleteReposMutation.mutate(deleteReposRequest);
  };

  return (
    <Row md={3} className="g-2 mb-2" data-testid={"AssignmentTabComponent"}>
      <Col md={6}>
        <Card className="h-100">
          <Card.Header>Individual Repository Assignment</Card.Header>
          <Card.Body>
            <IndividualAssignmentForm submitAction={postIndividualAssignment} />
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="h-100">
          <Card.Header>Team Repository Assignment</Card.Header>
          <Card.Body>
            <TeamRepositoryAssignmentForm submitAction={postTeamAssignment} />
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="h-100">
          <Card.Header>
            <div className="d-flex align-items-center gap-2">
              <span>Delete Empty Repositories</span>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="delete-empty-repos-tooltip">
                    Delete all repos in the organization that start with this
                    prefix and have no commits.
                  </Tooltip>
                }
              >
                <span
                  className="text-primary"
                  role="button"
                  tabIndex={0}
                  data-testid="DeleteRepos-help"
                >
                  ?
                </span>
              </OverlayTrigger>
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-muted small">
              Delete all repos in the organization that have names starting with
              the prefix below and have no commits.
            </p>
            <DeleteReposForm submitAction={postDeleteRepos} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
