import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/AuthService';
import { storage, StorageKeys } from '../../utils/storage';

interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthState {
    user: UserData | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true, // Start with loading true to checking session
    error: null,
    isAuthenticated: false,
};

// Async action to restore session on app start
export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, { rejectWithValue }) => {
        try {
            const session = await storage.getItem(StorageKeys.USER_SESSION);
            if (session) {
                return JSON.parse(session);
            }
            return null;
        } catch (error) {
            return rejectWithValue('Failed to restore session');
        }
    }
);

export const signInWithGoogle = createAsyncThunk(
    'auth/signInWithGoogle',
    async (_, { rejectWithValue }) => {
        try {
            const userCredential = await authService.signInWithGoogle();
            const user = userCredential.user;
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            };
            await storage.setItem(StorageKeys.USER_SESSION, JSON.stringify(userData));
            return userData;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign in');
        }
    }
);

export const signOutUser = createAsyncThunk(
    'auth/signOut',
    async () => {
        await authService.signOut();
        await storage.removeItem(StorageKeys.USER_SESSION);
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserData | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Restore Session
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
                state.loading = false;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.loading = false;
            })
            // Sign In
            .addCase(signInWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInWithGoogle.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(signInWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Sign Out
            .addCase(signOutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
