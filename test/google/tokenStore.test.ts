import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { deleteToken, loadToken, saveToken } from "../../src/google/tokenStore";

describe("tokenStore", () => {
  let tokenPath: string;

  beforeEach(() => {
    tokenPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "daybrief-test-")), "token.json");
  });

  afterEach(() => {
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath);
    }
  });

  it("returns null when no token has been saved", () => {
    expect(loadToken(tokenPath)).toBeNull();
  });

  it("round-trips a saved token", () => {
    saveToken({ access_token: "abc", refresh_token: "xyz" }, tokenPath);
    expect(loadToken(tokenPath)).toEqual({ access_token: "abc", refresh_token: "xyz" });
  });

  it("saves the token file with restrictive permissions", () => {
    saveToken({ access_token: "abc" }, tokenPath);
    const mode = fs.statSync(tokenPath).mode & 0o777;
    // Windows ignores POSIX mode bits; only assert the tighter permission on POSIX platforms.
    if (process.platform !== "win32") {
      expect(mode).toBe(0o600);
    }
  });

  it("deleteToken removes the file and is a no-op if it does not exist", () => {
    saveToken({ access_token: "abc" }, tokenPath);
    deleteToken(tokenPath);
    expect(fs.existsSync(tokenPath)).toBe(false);
    expect(() => deleteToken(tokenPath)).not.toThrow();
  });
});
