/**
 * @description Base64 解码字符串
 * @param {string} s 编码后的字符串
 * @returns {string} - 解码后的字符串
 */
export function base64Decode(s: string): string {
    if (!s) return s;
    const binaryString = atob(s);
    const utf8Bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        utf8Bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(utf8Bytes);
}

export function tryBase64Decode(s: string): string;
export function tryBase64Decode<C>(s: string, onCatch: (s: string) => string | C): string | C;

/**
 * @description 尝试 将Base64 解码字符串
 * @param {string} s 编码后的字符串
 * @param {(s:string) => string} onCatch - 解码失败时的回调函数
 * @returns {string} - 解码后的字符串
 */
export function tryBase64Decode<C>(s: string, onCatch?: (s: string) => string | C): string | C {
    const _onCatch = onCatch || ((s: string) => s);
    try {
        if (!s) return _onCatch(s);
        return base64Decode(s.toString());
    } catch {
        return _onCatch(s);
    }
}

/**
 * @description Base64 编码一个字符串
 * @param {string} s 要编码的字符串
 * @returns {string} - 编码后的字符串
 */
export function base64Encode(s: string): string {
    if (!s) return s;
    const utf8Bytes = new TextEncoder().encode(s.trim());
    let binaryString = '';
    for (let i = 0; i < utf8Bytes.length; i += 1) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binaryString);
}

export function tryBase64Encode(s: string): string;
export function tryBase64Encode<C>(s: string, onCatch: (s: string) => string | C): string | C;

/**
 * @description 尝试 使用 Base64 编码一个字符串
 * @param {string} s 要编码的字符串
 * @param {(s:string) => string} onCatch - 编码失败时的回调函数
 * @returns {string} - 编码后的字符串
 */
export function tryBase64Encode<C>(s: string, onCatch?: (s: string) => string | C): string | C {
    const _onCatch = onCatch || ((s: string) => s);
    try {
        if (!s) return _onCatch(s);
        return base64Encode(s.toString());
    } catch {
        return _onCatch(s);
    }
}
