/**
 * @description Base64 decode a string
 * @param {string} s Encoded string
 * @returns {string} - Decoded string
 */
export function base64Decode(s: string): string {
    try {
        const binaryString = atob(s);
        const utf8Bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            utf8Bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder().decode(utf8Bytes);
    } catch {
        return s;
    }
}
