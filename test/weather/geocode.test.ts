import { describe, expect, it } from "vitest";
import { geocodeLocation } from "../../src/weather/geocode";
import type { HttpClient } from "../../src/weather/httpClient";
import { ConfigError } from "../../src/output/errors";

describe("geocodeLocation", () => {
  it("resolves a matching city to lat/lon and a display name", async () => {
    const fakeHttp: HttpClient = {
      getJson: async <T>() =>
        ({
          results: [{ name: "Austin", admin1: "Texas", country: "United States", latitude: 30.27, longitude: -97.74 }],
        }) as T,
    };
    const location = await geocodeLocation("Austin, TX", fakeHttp);
    expect(location).toEqual({ name: "Austin, Texas, United States", latitude: 30.27, longitude: -97.74 });
  });

  it("throws a ConfigError when nothing matches", async () => {
    const fakeHttp: HttpClient = { getJson: async <T>() => ({ results: [] }) as T };
    await expect(geocodeLocation("Nowhereville", fakeHttp)).rejects.toThrow(ConfigError);
  });
});
