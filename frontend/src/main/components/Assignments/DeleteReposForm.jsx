import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";

export default function DeleteReposForm({ submitAction }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Form onSubmit={handleSubmit(submitAction)} data-testid="DeleteReposForm">
      <Form.Group className="mb-3">
        <Form.Label htmlFor="prefix">Repository Prefix</Form.Label>
        <Form.Control
          id="prefix"
          type="text"
          isInvalid={Boolean(errors.prefix)}
          data-testid="DeleteReposForm-prefix"
          {...register("prefix", {
            required: "Repository Prefix is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.prefix?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Button type="submit" data-testid="DeleteReposForm-submit">
          Delete Empty Matching Repos
        </Button>
      </Form.Group>
    </Form>
  );
}
