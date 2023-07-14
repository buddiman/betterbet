import api from '../api'

export const register = (username: string, email: string, password: string) => {
    return api.post("/auth/register", {
        user: {
            id: undefined,
            username: username,
            password: password,
            email: email,
            isAdmin: false
        }
    });
};

export const login = (username: string, password: string) => {
    return api
        .post("/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.jwt) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
};