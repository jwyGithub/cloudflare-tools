/**
 * IP 地址匹配规则验证函数
 *
 * 支持的匹配规则：
 * - `*` 允许所有 IP 访问
 * - `192.*.*.*` 允许 192 开头的 IP 访问
 * - `192.168.*.*` 允许 192.168 开头的 IP 访问
 * - `192.168.1.*` 允许 192.168.1 开头的 IP 访问
 * - `192.168.1.1` 只允许 192.168.1.1 访问
 * - `192.*.1.*` 允许 192 开头且第三段为 1 的 IP 访问
 * - `192.*.1.1` 允许 192 开头且后两段为 1.1 的 IP 访问
 * - `192.168.*.1` 允许 192.168 开头且最后一段为 1 的 IP 访问
 *
 * @example
 * ```typescript
 * // 直接验证 IP
 * validateIp('192.168.1.1', ['192.168.*.*']); // true
 *
 * // 验证请求对象
 * validateIp(request, ['192.168.*.*']); // true
 *
 * // 允许所有 IP
 * validateIp('10.0.0.1'); // true (默认规则 ['*'])
 *
 * // 多规则匹配
 * validateIp('192.168.1.100', [
 *   '10.0.0.*',      // 允许 10.0.0.x
 *   '192.168.1.*'    // 允许 192.168.1.x
 * ]); // true
 * ```
 *
 * @param input - IP 字符串或 Request 对象
 * @param match - IP 匹配规则数组，默认允许所有 IP
 * @returns 如果 IP 匹配任一规则返回 true，否则返回 false
 */
export function validateIp(input: string | Request, match: string[] | null = ['*']): boolean {
    // 获取要验证的 IP
    const ip =
        typeof input === 'string'
            ? input
            : input.headers.get('x-real-ip') || input.headers.get('cf-connecting-ip') || input.headers.get('x-forwarded-for');

    if (!ip) return false;
    if (!match || match.length === 0) return false;

    // 检查是否允许所有 IP
    if (match.includes('*')) return true;

    // 将 IP 规则转换为正则表达式
    const patterns = match.map(rule => {
        const pattern = rule.replace(/\./g, '\\.').replace(/\*/g, '\\d+');
        return new RegExp(`^${pattern}$`);
    });

    // 使用正则表达式匹配 IP
    return patterns.some(pattern => pattern.test(ip));
}

/**
 * 优化版本：使用预编译的正则表达式和缓存
 */
export class IpValidator {
    private patterns: RegExp[] = [];
    private allowAll = false;

    /**
     * @param rules - IP 匹配规则数组
     */
    constructor(rules: string[] = ['*']) {
        this.compile(rules);
    }

    /**
     * 编译规则为正则表达式
     */
    private compile(rules: string[]) {
        if (rules.includes('*')) {
            this.allowAll = true;
            return;
        }

        this.patterns = rules.map(rule => {
            const pattern = rule.replace(/\./g, '\\.').replace(/\*/g, '\\d+');
            return new RegExp(`^${pattern}$`);
        });
    }

    /**
     * 验证 IP 是否匹配规则
     * @param input - IP 字符串或 Request 对象
     */
    validate(input: string | Request): boolean {
        const ip =
            typeof input === 'string'
                ? input
                : input.headers.get('x-real-ip') || input.headers.get('cf-connecting-ip') || input.headers.get('x-forwarded-for');

        if (!ip) return false;
        if (this.allowAll) return true;

        return this.patterns.some(pattern => pattern.test(ip));
    }

    /**
     * 更新规则
     */
    updateRules(rules: string[]) {
        this.allowAll = false;
        this.patterns = [];
        this.compile(rules);
    }
}
