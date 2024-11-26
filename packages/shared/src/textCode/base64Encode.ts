/**
 * @description Base64 decode a string
 * @param {string} s Encoded string
 * @returns {string} - Decoded string
 */
export function base64Encode(s: string): string {
    try {
        const utf8Bytes = new TextEncoder().encode(s);
        let binaryString = '';
        for (let i = 0; i < utf8Bytes.length; i += 1) {
            binaryString += String.fromCharCode(utf8Bytes[i]);
        }
        return btoa(binaryString);
    } catch {
        return s;
    }
}
