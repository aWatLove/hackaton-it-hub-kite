export const valueExistInSelected = (value, values, props) =>
    !!values.find((val) => getByPath(val, props.valueField) === value || getByPath(val, props.labelField) === value);

export const debounce = (fn, delay = 0) => {
    let timerId;

    return (...args) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    };
};

export const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const getByPath = (object, path) => {
    if (!path) {
        return;
    }

    return path.split('.').reduce((acc, value) => acc[value], object);
};

export const getProp = (object, path, defaultValue) => {
    if (!path) {
        return object;
    }

    const normalizedPath = Array.isArray(path) ? path : path.split('.').filter((item) => item.length);

    if (!normalizedPath.length) {
        return object === undefined ? defaultValue : object;
    }

    return getProp(object[normalizedPath.shift()], normalizedPath, defaultValue);
};

export const isomorphicWindow = () => {
    if (typeof window === 'undefined') {
        return {};
    }

    return window;
};
