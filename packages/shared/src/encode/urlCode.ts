export function tryUrlDecode(s: string): string;
export function tryUrlDecode<C>(s: string, onCatch: (s: string) => string | C): string | C;

export function tryUrlDecode<C>(s: string, onCatch?: (s: string) => string | C): string | C {
    const _onCatch = onCatch || ((s: string) => s);
    try {
        if (!s) return _onCatch(s);
        return decodeURIComponent(s);
    } catch {
        return _onCatch(s);
    }
}

export function tryUrlEncode(s: string): string;
export function tryUrlEncode<C>(s: string, onCatch: (s: string) => string | C): string | C;

export function tryUrlEncode<C>(s: string, onCatch?: (s: string) => string | C): string | C {
    const _onCatch = onCatch || ((s: string) => s);
    try {
        if (!s) return _onCatch(s);
        return encodeURIComponent(s);
    } catch {
        return _onCatch(s);
    }
}
