import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/google/tokenStore", () => ({
  deleteToken: vi.fn(),
  loadToken: vi.fn(),
  saveToken: vi.fn(),
}));

import { deleteToken } from "../../src/google/tokenStore";
import { withGoogleErrorHandling } from "../../src/google/oauthClient";
import { AuthError } from "../../src/output/errors";

describe("withGoogleErrorHandling", () => {
  it("passes through a successful result", async () => {
    const result = await withGoogleErrorHandling(async () => "ok");
    expect(result).toBe("ok");
  });

  it("re-throws non-auth errors unchanged", async () => {
    await expect(
      withGoogleErrorHandling(async () => {
        throw new Error("network blip");
      })
    ).rejects.toThrow("network blip");
    expect(deleteToken).not.toHaveBeenCalled();
  });

  it("turns an invalid_grant failure into an AuthError and clears the stored token", async () => {
    await expect(
      withGoogleErrorHandling(async () => {
        throw new Error("invalid_grant: token has been revoked");
      })
    ).rejects.toThrow(AuthError);
    expect(deleteToken).toHaveBeenCalledTimes(1);
  });
});
