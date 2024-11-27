/**
 * @description ipv4
 */
export const ipv4Reg =
    /^(?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/;

/**
 * @description ipv6
 */
export const ipv6Reg = /^([0-9a-f]{1,4}:){7}([0-9a-f]{1,4})$/i;

/**
 * @description 是否是IP地址
 * @param ip IP地址
 * @returns 是否是IP地址
 */
export function isIPV4(ip: string): boolean {
    if (!ip) return false;

    return ipv4Reg.test(ip);
}

/**
 * @description 是否是IPV6地址
 * @param ip IP地址
 * @returns 是否是IPV6地址
 */
export function isIPV6(ip: string): boolean {
    if (!ip) return false;

    return ipv6Reg.test(ip);
}

/**
 * 检查给定的 IP 地址是否匹配指定的模式数组。
 *
 * @param ip - 要检查的 IP 地址。
 * @param match - 包含 IP 匹配模式的数组，可以为 null。
 * @returns 如果 IP 地址匹配任意一个模式，则返回 true；否则返回 false。
 */
export function checkIp(ip: string, match: string[] | null): boolean {
    if (!ip || !match) return false;
    for (let i = 0; i < match.length; i++) {
        const ipReg = new RegExp(match[i].replace(/\./g, '\\.').replace(/\*/g, '\\d+'));
        if (ipReg.test(ip)) {
            return true;
        }
    }
    return false;
}
