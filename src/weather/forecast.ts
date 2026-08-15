import type { WeatherSummary } from "../types";
import { fetchHttpClient, type HttpClient } from "./httpClient";

const WMO_CODE_DESCRIPTIONS: Record<number, string> = {
  0: "clear sky",
  1: "mostly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "fog",
  48: "freezing fog",
  51: "light drizzle",
  53: "moderate drizzle",
  55: "dense drizzle",
  56: "freezing drizzle",
  57: "freezing drizzle",
  61: "light rain",
  63: "moderate rain",
  65: "heavy rain",
  66: "freezing rain",
  67: "freezing rain",
  71: "light snow",
  73: "moderate snow",
  75: "heavy snow",
  77: "snow grains",
  80: "light rain showers",
  81: "moderate rain showers",
  82: "violent rain showers",
  85: "light snow showers",
  86: "heavy snow showers",
  95: "thunderstorm",
  96: "thunderstorm with hail",
  99: "thunderstorm with heavy hail",
};

export function describeWeatherCode(code: number): string {
  return WMO_CODE_DESCRIPTIONS[code] ?? "unknown conditions";
}

interface ForecastResponse {
  daily?: {
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  locationName: string,
  http: HttpClient = fetchHttpClient
): Promise<WeatherSummary> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&temperature_unit=fahrenheit&timezone=auto`;
  const data = await http.getJson<ForecastResponse>(url);
  const daily = data.daily;
  if (!daily) {
    throw new Error("Open-Meteo returned no forecast data.");
  }
  return {
    locationName,
    description: describeWeatherCode(daily.weathercode[0]),
    highTempF: Math.round(daily.temperature_2m_max[0]),
    lowTempF: Math.round(daily.temperature_2m_min[0]),
    precipitationChancePercent: Math.round(daily.precipitation_probability_max[0]),
  };
}
