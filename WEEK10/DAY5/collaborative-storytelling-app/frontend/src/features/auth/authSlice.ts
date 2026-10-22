import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthResponse, User } from "../../../../types/src/index"
import { apiRequest } from "../../api"

interface AuthState {
  user: User | null
  accessToken: string | null
  status: "loading" | "authenticated" | "anonymous"
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "loading",
  error: null,
}

export const restoreSession = createAsyncThunk<AuthResponse>(
  "auth/restore",
  () => apiRequest<AuthResponse>("/auth/refresh", { method: "POST" }),
)

export const signIn = createAsyncThunk<AuthResponse, { email: string; password: string }>(
  "auth/signIn",
  (credentials) => apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
)

export const signUp = createAsyncThunk<AuthResponse, { username: string; email: string; password: string }>(
  "auth/signUp",
  (details) => apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(details),
  }),
)

export const signOut = createAsyncThunk("auth/signOut", () =>
  apiRequest<void>("/auth/logout", { method: "POST" }),
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.status = "authenticated"
      state.error = null
    },
    clearSession(state) {
      state.user = null
      state.accessToken = null
      state.status = "anonymous"
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.status = "authenticated"
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "anonymous"
        state.user = null
        state.accessToken = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.status = "authenticated"
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.status = "authenticated"
        state.error = null
      })
      .addCase(signIn.pending, (state) => {
        state.error = null
      })
      .addCase(signUp.pending, (state) => {
        state.error = null
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error.message ?? "Please try again."
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.error.message ?? "Please try again."
      })
      .addMatcher(
        (action) => [signOut.fulfilled.type, signOut.rejected.type].includes(action.type),
        (state) => {
          state.user = null
          state.accessToken = null
          state.status = "anonymous"
        },
      )
  },
})

export const { setSession, clearSession, clearAuthError } = authSlice.actions
export default authSlice.reducer
