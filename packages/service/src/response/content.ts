/**
 * @description 将ArrayBuffer转换为文本
 * @param {ArrayBuffer} buffer - ArrayBuffer
 * @returns {string} - 文本
 */
export function arrayBufferToText(buffer: ArrayBuffer): string {
    return new TextDecoder().decode(buffer);
}

/**
 * @description 将Blob转换为文本
 * @param {Blob} blob - Blob
 * @returns {Promise<string>} - Promise<string>
 */
export function blobToText(blob: Blob): Promise<string> {
    return new Response(blob).text();
}

/**
 * @description 将ReadableStream转换为文本
 * @param {ReadableStream} stream - ReadableStream
 * @returns {Promise<string>} - Promise<string>
 */
export function streamToText(stream: ReadableStream): Promise<string> {
    const res = new Response(stream);
    return res.text();
}
