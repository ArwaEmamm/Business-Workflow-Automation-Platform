// Utility to decode JWT and extract role if not present in user object
export const decodeJWT = (token: string): { role?: string; sub?: string; [key: string]: any } | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch {
        return null;
    }
};
