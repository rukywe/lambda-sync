export async function downloadFunctionCode(url: string): Promise<ArrayBuffer> {
  const { default: fetch } = await import('node-fetch');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download function code from ${url}`);
  }
  return await response.arrayBuffer();
}
