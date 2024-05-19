export async function downloadFunctionCode(url: string): Promise<ArrayBuffer> {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download function code from ${url}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    throw error;
  }
}

export function sanitizeUrl(url: string): string {
  try {
    const sanitizedUrl = new URL(url);
    sanitizedUrl.search = '';
    return sanitizedUrl.toString();
  } catch {
    return url;
  }
}
