/**
 * @description Convert a blob to text
 * @param {Blob} blob - Blob
 * @returns {Promise<string>} - Promise<string>
 */
export function blobToText(blob: Blob): Promise<string> {
    return new Response(blob).text();
}
