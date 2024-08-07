import { createContext, useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import Cookies from 'js-cookie';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();

    const signIn = async ({ email, password }) => {
        return api
            .post('/v1/sessions', { email, password })
            .then((response) => {
                api.defaults.headers.Authorization = `Bearer ${response.data.token}`;

                setUser(response.data.user);

                localStorage.setItem('@username', response.data.user)

                Cookies.set('token', response.data.token, {
                    expires: 30,
                    secure: true,
                    sameSite: true,
                });

                return { success: false };
            })
            .catch((e) => {
                return e.response
            });
    };

    const refresh = async () => {
        try {
            const response = await api.post('/v1/sessions/refresh', {});
            const newToken = response.data.token;

            api.defaults.headers.Authorization = `Bearer ${newToken}`;

            Cookies.remove('token');
            Cookies.set('token', newToken, { expires: 30, secure: true, sameSite: true });
            location.reload();

            setUser(response.data.user);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${token}`;

            setUser(token);
        }
    }, []);

    async function signOut() {
        Cookies.remove('token');
        window.location.href = '/';

        api.defaults.headers.Authorization = undefined;
        setUser(null);
    }

    return <AuthContext.Provider value={{ user, signIn, signOut, refresh }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    return context;
};
