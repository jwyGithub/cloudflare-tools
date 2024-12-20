import { describe, expect, it } from 'vitest';
import { IpValidator, validateIp } from '../src/validate/validateIp';

describe('validateIp', () => {
    describe('基本功能', () => {
        it('应该正确验证 IP 字符串', () => {
            expect(validateIp('192.168.1.1', ['192.168.1.1'])).toBe(true);
            expect(validateIp('192.168.1.2', ['192.168.1.1'])).toBe(false);
        });

        it('应该正确验证 Request 对象', () => {
            const request = new Request('https://example.com', {
                headers: {
                    'x-real-ip': '192.168.1.1'
                }
            });
            expect(validateIp(request, ['192.168.1.1'])).toBe(true);
        });

        it('应该处理无效的 IP 输入', () => {
            const request = new Request('https://example.com');
            expect(validateIp(request)).toBe(false);
            expect(validateIp('')).toBe(false);
        });
    });

    describe('通配符匹配', () => {
        it('应该支持全局通配符', () => {
            expect(validateIp('192.168.1.1')).toBe(true); // 默认规则 ['*']
            expect(validateIp('10.0.0.1', ['*'])).toBe(true);
        });

        it('应该支持段通配符', () => {
            const rules = ['192.168.*.*'];
            expect(validateIp('192.168.1.1', rules)).toBe(true);
            expect(validateIp('192.168.2.3', rules)).toBe(true);
            expect(validateIp('192.169.1.1', rules)).toBe(false);
        });

        it('应该支持复杂通配符模式', () => {
            const rules = ['192.*.1.*'];
            expect(validateIp('192.168.1.1', rules)).toBe(true);
            expect(validateIp('192.100.1.200', rules)).toBe(true);
            expect(validateIp('192.168.2.1', rules)).toBe(false);
        });
    });

    describe('多规则匹配', () => {
        it('应该支持多个规则', () => {
            const rules = ['192.168.1.*', '10.0.0.*'];
            expect(validateIp('192.168.1.1', rules)).toBe(true);
            expect(validateIp('10.0.0.1', rules)).toBe(true);
            expect(validateIp('172.16.0.1', rules)).toBe(false);
        });

        it('应该处理空规则数组', () => {
            expect(validateIp('192.168.1.1', [])).toBe(false);
            expect(validateIp('192.168.1.1', null)).toBe(false);
        });
    });
});

describe('ipValidator', () => {
    describe('基本功能', () => {
        it('应该使用默认规则', () => {
            const validator = new IpValidator();
            expect(validator.validate('192.168.1.1')).toBe(true);
        });

        it('应该正确验证 IP', () => {
            const validator = new IpValidator(['192.168.1.*']);
            expect(validator.validate('192.168.1.1')).toBe(true);
            expect(validator.validate('192.168.2.1')).toBe(false);
        });

        it('应该支持 Request 对象', () => {
            const validator = new IpValidator(['192.168.1.*']);
            const request = new Request('https://example.com', {
                headers: {
                    'x-real-ip': '192.168.1.1'
                }
            });
            expect(validator.validate(request)).toBe(true);
        });
    });

    describe('规则更新', () => {
        it('应该正确更新规则', () => {
            const validator = new IpValidator(['192.168.1.*']);
            expect(validator.validate('10.0.0.1')).toBe(false);

            validator.updateRules(['10.0.0.*']);
            expect(validator.validate('10.0.0.1')).toBe(true);
            expect(validator.validate('192.168.1.1')).toBe(false);
        });

        it('应该处理规则更新为全局通配符', () => {
            const validator = new IpValidator(['192.168.1.*']);
            validator.updateRules(['*']);
            expect(validator.validate('10.0.0.1')).toBe(true);
        });
    });

    describe('性能优化', () => {
        it('应该缓存编译后的正则表达式', () => {
            const validator = new IpValidator(['192.168.*.*']);
            const startTime = performance.now();

            // 多次验证同一规则
            for (let i = 0; i < 1000; i++) {
                validator.validate('192.168.1.1');
            }

            const endTime = performance.now();
            expect(endTime - startTime).toBeLessThan(100); // 确保性能在合理范围内
        });
    });

    describe('边界情况', () => {
        it('应该处理无效的 IP 输入', () => {
            const validator = new IpValidator();
            const request = new Request('https://example.com');
            expect(validator.validate(request)).toBe(false);
            expect(validator.validate('')).toBe(false);
        });

        it('应该处理特殊的 IP 格式', () => {
            const validator = new IpValidator(['192.168.*.*']);
            expect(validator.validate('192.168.001.001')).toBe(true);
            expect(validator.validate('192.168.1.1')).toBe(true);
        });
    });
});
