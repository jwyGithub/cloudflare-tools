/**
 * @description Convert an array buffer to text
 * @param {ArrayBuffer} buffer - ArrayBuffer
 * @returns {string} - Text
 */
export function arrayBufferToText(buffer: ArrayBuffer): string {
    return new TextDecoder().decode(buffer);
}
