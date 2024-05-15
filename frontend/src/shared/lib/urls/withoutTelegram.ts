export const telegramUrlParse = (url: string) => {
    if (url.startsWith('@')) return url;
    return url.replace('https://web.telegram.org/k/#@', '');
};
export const telegramUrlAdd = (url: string) => {
    if (url.startsWith('@')) return url;
    return `https://web.telegram.org/k/#${url}`;
};
export const emailUrlParse = (url: string) => {
    if (!url.startsWith('http')) return url;
    return url.split('@')[0] || url;
};
