// headers.ts
export function buildHeaders(contentType: string, authToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}
