/* eslint-disable ts/ban-ts-comment */
import { describe, expect, it } from 'vitest';
import { hexDecode, hexEncode, tryHexDecode, tryHexEncode } from '../index';

describe('十六进制编解码函数测试', () => {
    // hexEncode 测试
    describe('hexEncode', () => {
        // 正向测试用例
        it('应正确编码ASCII字符串', () => {
            expect(hexEncode('Hello')).toBe('48656c6c6f');
        });

        it('应正确编码包含空格的字符串', () => {
            expect(hexEncode('Hello World')).toBe('48656c6c6f20576f726c64');
        });

        it('应正确编码中文字符串', () => {
            expect(hexEncode('你好')).toBe('e4bda0e5a5bd');
        });

        it('应正确处理空字符串', () => {
            expect(hexEncode('')).toBe('');
        });

        it('应正确编码特殊字符', () => {
            expect(hexEncode('!@#$')).toBe('21402324');
        });

        // 反向测试用例
        it('应处理undefined输入', () => {
            // @ts-ignore
            expect(() => hexEncode(undefined)).toThrow('Input must be a string');
        });

        it('应处理null输入', () => {
            // @ts-ignore
            expect(() => hexEncode(null)).toThrow('Input must be a string');
        });
    });

    // hexDecode 测试
    describe('hexDecode', () => {
        // 正向测试用例
        it('应正确解码十六进制字符串', () => {
            expect(hexDecode('48656c6c6f')).toBe('Hello');
        });

        it('应正确解码包含空格的十六进制字符串', () => {
            expect(hexDecode('48656c6c6f20576f726c64')).toBe('Hello World');
        });

        it('应正确解码中文字符的十六进制字符串', () => {
            expect(hexDecode('e4bda0e5a5bd')).toBe('你好');
        });

        it('应正确处理空字符串', () => {
            expect(hexDecode('')).toBe('');
        });

        // 反向测试用例
        it('应处理无效的十六进制字符串', () => {
            expect(() => hexDecode('zz')).toThrow('Invalid hex string');
        });

        it('应处理奇数长度的十六进制字符串', () => {
            expect(() => hexDecode('48656')).toThrow('Hex string must have an even length');
        });
    });

    // tryHexEncode 测试
    describe('tryHexEncode', () => {
        // 正向测试用例
        it('应正确编码有效输入', () => {
            expect(tryHexEncode('Hello')).toBe('48656c6c6f');
        });

        it('应正确处理空字符串', () => {
            expect(tryHexEncode('')).toBe('');
        });

        // 反向测试用例
        it('应安全处理undefined', () => {
            // @ts-ignore
            expect(tryHexEncode(undefined)).toBeUndefined();
        });

        it('应安全处理null', () => {
            // @ts-ignore
            expect(tryHexEncode(null)).toBeNull();
        });

        it('应安全处理非字符串输入', () => {
            // @ts-ignore
            expect(tryHexEncode(123)).toBe(123);
        });
    });

    // tryHexDecode 测试
    describe('tryHexDecode', () => {
        // 正向测试用例
        it('应正确解码有效的十六进制字符串', () => {
            expect(tryHexDecode('48656c6c6f')).toBe('Hello');
        });

        it('应正确处理空字符串', () => {
            expect(tryHexDecode('')).toBe('');
        });

        // 反向测试用例
        it('应安全处理undefined', () => {
            // @ts-ignore
            expect(tryHexDecode(undefined)).toBeUndefined();
        });

        it('应安全处理null', () => {
            // @ts-ignore
            expect(tryHexDecode(null)).toBeNull();
        });

        it('应安全处理无效的十六进制字符串', () => {
            expect(tryHexDecode('invalid hex!')).toBe('invalid hex!');
        });

        it('应安全处理奇数长度的十六进制字符串', () => {
            expect(tryHexDecode('48656')).toBe('48656');
        });
    });

    // 集成测试
    describe('编解码集成测试', () => {
        it('编码后解码应得到原始字符串', () => {
            const original = 'Hello World! 你好';
            const encoded = hexEncode(original);
            const decoded = hexDecode(encoded);
            expect(decoded).toBe(original);
        });

        it('使用try版本进行编解码应得到原始字符串', () => {
            const original = 'Hello World! 你好';
            const encoded = tryHexEncode(original);
            const decoded = tryHexDecode(encoded);
            expect(decoded).toBe(original);
        });
    });

    // 边界情况测试
    describe('边界情况测试', () => {
        it('应正确处理包含各种Unicode字符的字符串', () => {
            const original = '你好，World! 🌎 ❤️ №';
            const encoded = hexEncode(original);
            const decoded = hexDecode(encoded);
            expect(decoded).toBe(original);
        });

        it('应正确处理很长的字符串', () => {
            const original = 'a'.repeat(1000);
            const encoded = hexEncode(original);
            const decoded = hexDecode(encoded);
            expect(decoded).toBe(original);
        });
    });
});
