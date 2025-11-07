const API_BASE_URL = 'http://localhost:4000/api'

// Types
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

// Utility function to store the token
export const storeToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}

// Utility function to get the stored token
export const getStoredToken = () => {
    return localStorage.getItem(TOKEN_KEY)
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
    storeToken(data.token)
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
    storeToken(data.token)
    return data
}

export const logout = async (): Promise<void> => {
    localStorage.removeItem(TOKEN_KEY)
}