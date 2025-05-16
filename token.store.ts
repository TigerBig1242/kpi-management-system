const refreshTokens: string[] = [];

export const saveToken = (token: string) => refreshTokens.push(token);
export const isTokenValid = (token: string) => refreshTokens.includes(token);
export const removeToken = (token: string) => {
    const index = refreshTokens.indexOf(token);
    if (index > -1) {
        refreshTokens.splice(index, 1);
    }
}