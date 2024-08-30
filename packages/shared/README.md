# @jiangweiye/cloudflare-shared

### install

#### with pnpm

```sh
pnpm add @jiangweiye/cloudflare-shared
```

#### with yarn

```sh
yarn add @jiangweiye/cloudflare-shared
```

#### with npm

```sh
npm install @jiangweiye/cloudflare-shared
```

## type

```typescript
export declare class TextCode {
    /**
     * @description Base64 decode a string
     * @param {string} s Encoded string
     * @returns {string} - Decoded string
     */
    static base64Encode(s: string): string;
    /**
     * @description Base64 decode a string
     * @param {string} s Encoded string
     * @returns {string} - Decoded string
     */
    static base64Decode(s: string): string;
    /**
     * @description Convert a stream to text
     * @param {ReadableStream} stream - ReadableStream
     * @returns {Promise<string>} - Promise<string>
     */
    static streamToText(stream: ReadableStream): Promise<string>;
    /**
     * @description Convert a blob to text
     * @param {Blob} blob - Blob
     * @returns {Promise<string>} - Promise<string>
     */
    static blobToText(blob: Blob): Promise<string>;
    /**
     * @description Convert an array buffer to text
     * @param {ArrayBuffer} buffer - ArrayBuffer
     * @returns {string} - Text
     */
    static arrayBufferToText(buffer: ArrayBuffer): string;
}
```
