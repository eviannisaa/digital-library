interface FetchDataOptions {
  method?: string;
  headers?: HeadersInit;
  body?: any;
}

export const fetchData = async (url: string, options?: FetchDataOptions) => {
  const response = await fetch(url, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};
