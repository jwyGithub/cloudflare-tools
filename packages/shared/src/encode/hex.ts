/**
 * @description 将普通字符串编码为十六进制字符串。
 * @param s 要编码的字符串。
 * @returns 编码后的字符串
 */
export function hexEncode(s: string): string {
    if (typeof s !== 'string') {
        throw new TypeError('Input must be a string');
    }
    const encoder = new TextEncoder();
    const bytes = encoder.encode(s);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * @description 尝试将普通字符串编码为十六进制字符串。
 * @param s 要编码的字符串。
 * @returns 编码后的字符串
 */
export function tryHexEncode(s: string): string {
    try {
        if (!s) return s;
        return hexEncode(s);
    } catch {
        return s;
    }
}

/**
 * 将十六进制字符串解码为普通字符串。
 *
 * @param s - 要解码的十六进制字符串。
 * @returns 解码后的普通字符串。
 */
export function hexDecode(s: string): string {
    if (typeof s !== 'string') {
        throw new TypeError('Input must be a string');
    }
    if (s.length % 2 !== 0) {
        throw new Error('Hex string must have an even length');
    }
    if (!/^[0-9A-F]*$/i.test(s)) {
        throw new Error('Invalid hex string');
    }
    const bytes = new Uint8Array(s.length / 2);
    for (let i = 0; i < s.length; i += 2) {
        bytes[i / 2] = Number.parseInt(s.slice(i, i + 2), 16);
    }
    return new TextDecoder().decode(bytes);
}

/**
 * 尝试将十六进制字符串解码为普通字符串。
 *
 * @param s - 要解码的十六进制字符串。
 * @returns 解码后的普通字符串。
 */
export function tryHexDecode(s: string): string {
    try {
        if (!s) return s;
        return hexDecode(s);
    } catch {
        return s;
    }
}
