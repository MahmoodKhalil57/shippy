import { describe, expect, it } from "vite-plus/test";
import { ApiError } from "./errors.ts";

describe("ApiError", () => {
  it("joins the messages of every error", () => {
    const e = new ApiError(400, [
      { message: "Email is taken" },
      { message: "Name is required", name: "ValidationError" },
    ]);
    expect(e).toBeInstanceOf(Error);
    expect([e.status, e.message]).toEqual([400, "Email is taken; Name is required"]);
  });

  it("names the status when there are no messages", () => {
    expect(new ApiError(500, []).message).toBe("Request failed (500)");
    expect(new ApiError(404, [{ message: "" }]).message).toBe("Request failed (404)");
  });

  it("collects the message of every field error by its path", () => {
    const e = new ApiError(400, [
      {
        message: "The following fields are invalid",
        data: {
          errors: [
            { path: "email", message: "Email is taken" },
            { path: "lines.0.qty", message: "1 or more." },
          ],
        },
      },
      { message: "Second", data: { errors: [{ path: "email", message: "Email is not valid" }] } },
      { message: "No data" },
      { message: "No field errors", data: {} },
    ]);
    expect(e.fieldErrors).toEqual({ email: "Email is not valid", "lines.0.qty": "1 or more." });
    expect(new ApiError(401, []).fieldErrors).toEqual({});
  });
});
