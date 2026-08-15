import { ConfigError } from "../output/errors";
import { fetchHttpClient, type HttpClient } from "./httpClient";

export interface GeocodedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: Array<{ name: string; admin1?: string; country?: string; latitude: number; longitude: number }>;
}

export async function geocodeLocation(query: string, http: HttpClient = fetchHttpClient): Promise<GeocodedLocation> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
  const data = await http.getJson<GeocodingResponse>(url);
  const result = data.results?.[0];
  if (!result) {
    throw new ConfigError(`Could not find a location matching "${query}". Try a nearby city name.`);
  }
  const parts = [result.name, result.admin1, result.country].filter(Boolean);
  return { name: parts.join(", "), latitude: result.latitude, longitude: result.longitude };
}
