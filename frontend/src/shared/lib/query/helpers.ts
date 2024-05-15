export const removeUnusedQueryParams = (query) => Object.fromEntries(Object.entries(query).filter(([_, v]) => v !== undefined));
