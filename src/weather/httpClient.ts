export interface HttpClient {
  getJson<T>(url: string): Promise<T>;
}

export const fetchHttpClient: HttpClient = {
  async getJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${url}`);
    }
    return (await res.json()) as T;
  },
};
