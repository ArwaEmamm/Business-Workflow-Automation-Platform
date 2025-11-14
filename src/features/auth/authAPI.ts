const API_BASE_URL = 'http://localhost:4000/api'

import { decodeJWT } from '../../utils/jwt'
export interface Credentials {
    email: string
    password: string
}

export interface RegisterCredentials extends Credentials {
    name: string
    role?: string // جعلناه اختياري لأنه قد لا يتم تحديده من واجهة المستخدم
}

export interface User {
    id: string
    name: string
    email: string
    role: string
}

export interface AuthResponse {
    message: string
    user: User
    token: string
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

// Utility function to store the token
export const storeToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}

// Utility function to get the stored token
export const getStoredToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

// Utility functions to store/get user
export const storeUser = (user: User) => {
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {
        // ignore
    }
}

export const getStoredUser = (): User | null => {
    try {
        const raw = localStorage.getItem(USER_KEY)
        return raw ? JSON.parse(raw) as User : null
    } catch {
        return null
    }
}

export const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}

// API Functions
export const login = async (credentials: Credentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to login')
    }

    const data = await response.json()
    console.log('Backend login response:', data);
    console.log('User object:', data.user);
    console.log('User role from backend:', data.user?.role);
    
    // Ensure user.role is set; if not, extract from JWT token
    if (data.user && !data.user.role && data.token) {
        const decoded = decodeJWT(data.token);
        if (decoded?.role) {
            data.user.role = decoded.role;
            console.log('Role extracted from JWT token:', data.user.role);
        }
    }
    
    // persist token and user to localStorage for page reloads
    if (data.token) storeToken(data.token)
    if (data.user) storeUser(data.user)
    return data
}

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to register')
    }

    const data = await response.json()
    console.log('Backend register response:', data);
    console.log('User object:', data.user);
    console.log('User role from backend:', data.user?.role);

    // DON'T store token/user after registration - user should login manually
    // This ensures proper authentication flow
    return data
}

export const logout = async (): Promise<void> => {
    clearStoredAuth()
}