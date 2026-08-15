import { describe, expect, it } from "vitest";
import { describeWeatherCode, fetchForecast } from "../../src/weather/forecast";
import type { HttpClient } from "../../src/weather/httpClient";

describe("describeWeatherCode", () => {
  it("maps known WMO codes to descriptions", () => {
    expect(describeWeatherCode(61)).toBe("light rain");
    expect(describeWeatherCode(0)).toBe("clear sky");
  });

  it("falls back gracefully for unknown codes", () => {
    expect(describeWeatherCode(9999)).toBe("unknown conditions");
  });
});

describe("fetchForecast", () => {
  it("maps the Open-Meteo response onto a WeatherSummary", async () => {
    const fakeHttp: HttpClient = {
      getJson: async <T>() =>
        ({
          daily: {
            weathercode: [61],
            temperature_2m_max: [61.4],
            temperature_2m_min: [52.2],
            precipitation_probability_max: [80],
          },
        }) as T,
    };

    const weather = await fetchForecast(30.27, -97.74, "Austin, TX", fakeHttp);
    expect(weather).toEqual({
      locationName: "Austin, TX",
      description: "light rain",
      highTempF: 61,
      lowTempF: 52,
      precipitationChancePercent: 80,
    });
  });

  it("propagates a network failure so the tool layer can report it", async () => {
    const failingHttp: HttpClient = {
      getJson: async () => {
        throw new Error("HTTP 503 fetching open-meteo");
      },
    };
    await expect(fetchForecast(30.27, -97.74, "Austin, TX", failingHttp)).rejects.toThrow(/503/);
  });
});
