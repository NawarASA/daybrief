export class DaybriefError extends Error {
  constructor(
    message: string,
    public readonly exitCode: number = 1
  ) {
    super(message);
    this.name = "DaybriefError";
  }
}

export class ConfigError extends DaybriefError {
  constructor(message: string) {
    super(message, 2);
    this.name = "ConfigError";
  }
}

export class AuthError extends DaybriefError {
  constructor(message: string) {
    super(message, 2);
    this.name = "AuthError";
  }
}
