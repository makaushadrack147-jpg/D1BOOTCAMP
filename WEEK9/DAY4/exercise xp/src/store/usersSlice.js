import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (userId, { rejectWithValue, signal }) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        { signal },
      )

      if (!response.ok) {
        return rejectWithValue(
          `The API could not find user ${userId} (HTTP ${response.status}). Try an ID from 1 to 10.`,
        )
      }

      const user = await response.json()
      if (!user || typeof user.id !== 'number' || !user.name || !user.email) {
        return rejectWithValue('The API returned incomplete user data. Please try again.')
      }

      return user
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error
      }

      return rejectWithValue(
        'Unable to reach the user API. Check your connection and try again.',
      )
    }
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Something went wrong.'
      })
  },
})

export default usersSlice.reducer
