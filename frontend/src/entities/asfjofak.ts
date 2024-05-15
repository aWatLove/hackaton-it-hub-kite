export const setToken = async (token: string) => {
    const formData = new FormData();
    formData.append('token', token);
    await fetch('/api/settoken', { body: formData, method: 'POST' });
};
