/**
 * @description Convert a stream to text
 * @param {ReadableStream} stream - ReadableStream
 * @returns {Promise<string>} - Promise<string>
 */
export function streamToText(stream: ReadableStream): Promise<string> {
    const res = new Response(stream);
    return res.text();
}
