import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { 
    login as loginAPI, 
    register as registerAPI,
    logout as logoutAPI,
    getStoredToken,
    getStoredUser,
    type User,
    type Credentials,
    type RegisterCredentials,
    type AuthResponse
} from './authAPI'

// State Type
interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

// Initial State
const token = getStoredToken()
const storedUser = getStoredUser()
const initialState: AuthState = {
    user: storedUser,
    token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
}

// Async Actions
export const loginUser = createAsyncThunk<AuthResponse, Credentials>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginAPI(credentials)
            return response
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue('An unexpected error occurred')
        }
    }
)

export const registerUser = createAsyncThunk<AuthResponse, RegisterCredentials>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await registerAPI(credentials)
            return response
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue('An unexpected error occurred')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logoutAPI()
            return null
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue('An unexpected error occurred')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false
                console.log('Auth slice loginUser.fulfilled - payload:', payload);
                console.log('Auth slice setting user:', payload.user);
                state.user = payload.user
                state.token = payload.token
                state.isAuthenticated = true
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload as string
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false
                // Don't auto-login after registration
                // User should login manually after registration
                console.log('Registration successful - user should login manually');
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload as string
            })
            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false
                state.user = null
                state.token = null
                state.isAuthenticated = false
            })
            .addCase(logoutUser.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload as string
            })
    },
})

export const { clearError } = authSlice.actions

export default authSlice.reducer