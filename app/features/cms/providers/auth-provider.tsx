import { type AuthProvider } from 'react-admin';

type User = {
    image: {
        id: string;
    } | null;
    name: string | null;
    id: string;
    roles: {
        name: string;
        permissions: {
            action: string;
            entity: string;
            access: string;
        }[];
    }[];
    username: string;
} | null;

export const authProvider = (user?: User): AuthProvider => ({
    login: async () => {},
    logout: async () => {
        await fetch('/logout', { method: 'POST' });
    },
    checkAuth: async () => {
        if (user) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Not authenticated'));
    },
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
    getIdentity: () => {
        if (user) {
            return Promise.resolve({
                id: user.id,
                fullName: user.name ?? user.username,
            });
        }
        return Promise.reject(new Error('Not authenticated'));
    },
});
