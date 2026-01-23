import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/AuthService';

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
    loading: false,
    error: null,
    isAuthenticated: false,
};

export const signInWithGoogle = createAsyncThunk(
    'auth/signInWithGoogle',
    async (_, { rejectWithValue }) => {
        try {
            const userCredential = await authService.signInWithGoogle();
            const user = userCredential.user;
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign in');
        }
    }
);

export const signOutUser = createAsyncThunk(
    'auth/signOut',
    async () => {
        await authService.signOut();
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
            .addCase(signOutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
