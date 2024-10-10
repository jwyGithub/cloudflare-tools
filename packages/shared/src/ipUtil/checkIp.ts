import { isIp } from './isIp';

/**
 * Checks if the given IP address matches any pattern in the provided list.
 *
 * @param ip - The IP address to check.
 * @param match - An array of string patterns to match against the IP address.
 *                Patterns can include wildcards (*) which match any number of digits.
 * @returns `true` if the IP address matches any pattern in the list, otherwise `false`.
 */
export function checkIp(ip: string | null, match: string[] | null): boolean {
    if (!ip || !match) return false;
    if (!isIp(ip)) return false;
    for (let i = 0; i < match.length; i++) {
        const ipReg = new RegExp(match[i].replace(/\./g, '\\.').replace(/\*/g, '\\d+'));
        if (ipReg.test(ip)) {
            return true;
        }
    }
    return false;
}
