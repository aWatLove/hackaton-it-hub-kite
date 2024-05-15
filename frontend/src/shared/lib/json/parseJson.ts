export function parseJson<T extends unknown>(str: string): T | undefined {
    try {
        return JSON.parse(str);
    } catch (e) {
        return undefined;
    }
}
