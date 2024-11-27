/* eslint-disable ts/ban-ts-comment */
import { describe, expect, it } from 'vitest';
import { base64Decode, base64Encode, tryBase64Decode, tryBase64Encode } from '../index';

describe('base64 编解码函数测试', () => {
    // base64Encode 测试
    describe('base64Encode', () => {
        // 正向测试用例
        it('应正确编码普通ASCII字符串', () => {
            expect(base64Encode('Hello World')).toBe('SGVsbG8gV29ybGQ=');
        });

        it('应正确编码包含中文的字符串', () => {
            expect(base64Encode('你好，世界')).toBe('5L2g5aW977yM5LiW55WM');
        });

        it('应正确处理空字符串', () => {
            expect(base64Encode('')).toBe('');
        });

        it('应正确编码包含特殊字符的字符串', () => {
            expect(base64Encode('!@#$%^&*()')).toBe('IUAjJCVeJiooKQ==');
        });

        // 反向测试用例
        it('应处理undefined输入', () => {
            // @ts-expect-error
            expect(base64Encode(undefined)).toBeUndefined();
        });

        it('应处理null输入', () => {
            // @ts-expect-error
            expect(base64Encode(null)).toBeNull();
        });
    });

    // base64Decode 测试
    describe('base64Decode', () => {
        // 正向测试用例
        it('应正确解码Base64字符串', () => {
            expect(base64Decode('SGVsbG8gV29ybGQ=')).toBe('Hello World');
        });

        it('应正确解码包含中文的Base64字符串', () => {
            expect(base64Decode('5L2g5aW977yM5LiW55WM')).toBe('你好，世界');
        });

        it('应正确处理空字符串', () => {
            expect(base64Decode('')).toBe('');
        });

        // 反向测试用例
        it('应处理非法Base64字符串', () => {
            expect(tryBase64Decode('这不是Base64!')).toBe('这不是Base64!');
        });

        it('应处理包含空格的Base64字符串', () => {
            expect(base64Decode('SGVsbG8gV29ybGQ= ')).toBe('Hello World');
        });
    });

    // tryBase64Encode 测试
    describe('tryBase64Encode', () => {
        // 正向测试用例
        it('应正确编码有效输入', () => {
            expect(tryBase64Encode('Hello World')).toBe('SGVsbG8gV29ybGQ=');
        });

        it('应正确处理空字符串', () => {
            expect(tryBase64Encode('')).toBe('');
        });

        // 反向测试用例
        it('应安全处理undefined', () => {
            // @ts-ignore
            expect(tryBase64Encode(undefined)).toBeUndefined();
        });

        it('应安全处理null', () => {
            // @ts-ignore
            expect(tryBase64Encode(null)).toBeNull();
        });

        it('应安全处理非字符串输入', () => {
            // @ts-ignore
            expect(tryBase64Encode(123)).toBe('MTIz');
        });
    });

    // tryBase64Decode 测试
    describe('tryBase64Decode', () => {
        // 正向测试用例
        it('应正确解码有效的Base64字符串', () => {
            expect(tryBase64Decode('SGVsbG8gV29ybGQ=')).toBe('Hello World');
        });

        it('应正确处理空字符串', () => {
            expect(tryBase64Decode('')).toBe('');
        });

        // 反向测试用例
        it('应安全处理undefined', () => {
            // @ts-ignore
            expect(tryBase64Decode(undefined)).toBeUndefined();
        });

        it('应安全处理null', () => {
            // @ts-ignore
            expect(tryBase64Decode(null)).toBeNull();
        });

        it('应安全处理无效的Base64字符串', () => {
            expect(tryBase64Decode('invalid base64!')).toBe('invalid base64!');
        });
    });

    // 集成测试
    describe('编解码集成测试', () => {
        it('编码后解码应得到原始字符串', () => {
            const original = '你好，World! 🌎';
            const encoded = base64Encode(original);
            const decoded = base64Decode(encoded);
            expect(decoded).toBe(original);
        });

        it('使用try版本进行编解码应得到原始字符串', () => {
            const original = '你好，World! 🌎';
            const encoded = tryBase64Encode(original);
            const decoded = tryBase64Decode(encoded);
            expect(decoded).toBe(original);
        });
    });
});
