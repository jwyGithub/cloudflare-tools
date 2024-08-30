export class TextCode {
    /**
     * @description Base64 decode a string
     * @param {string} s Encoded string
     * @returns {string} - Decoded string
     */
    public static base64Encode(s: string): string {
        const utf8Bytes = new TextEncoder().encode(s);
        let binaryString = '';
        for (let i = 0; i < utf8Bytes.length; i += 1) {
            binaryString += String.fromCharCode(utf8Bytes[i]);
        }
        return btoa(binaryString);
    }

    /**
     * @description Base64 decode a string
     * @param {string} s Encoded string
     * @returns {string} - Decoded string
     */
    public static base64Decode(s: string): string {
        const binaryString = atob(s);
        const utf8Bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            utf8Bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder().decode(utf8Bytes);
    }

    /**
     * @description Convert a stream to text
     * @param {ReadableStream} stream - ReadableStream
     * @returns {Promise<string>} - Promise<string>
     */
    public static streamToText(stream: ReadableStream): Promise<string> {
        const res = new Response(stream);
        return res.text();
    }

    /**
     * @description Convert a blob to text
     * @param {Blob} blob - Blob
     * @returns {Promise<string>} - Promise<string>
     */
    public static blobToText(blob: Blob): Promise<string> {
        return new Response(blob).text();
    }

    /**
     * @description Convert an array buffer to text
     * @param {ArrayBuffer} buffer - ArrayBuffer
     * @returns {string} - Text
     */
    public static arrayBufferToText(buffer: ArrayBuffer): string {
        return new TextDecoder().decode(buffer);
    }
}
