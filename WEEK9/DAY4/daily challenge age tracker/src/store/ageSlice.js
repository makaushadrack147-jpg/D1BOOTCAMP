import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const UPDATE_DELAY = 700

function waitForUpdate(signal) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, UPDATE_DELAY)

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId)
        reject(new DOMException('Age update was cancelled.', 'AbortError'))
      },
      { once: true },
    )
  })
}

export const ageUpAsync = createAsyncThunk('age/ageUpAsync', async (_, { signal }) => {
  await waitForUpdate(signal)
  return 1
})

export const ageDownAsync = createAsyncThunk('age/ageDownAsync', async (_, { signal }) => {
  await waitForUpdate(signal)
  return 1
})

const ageSlice = createSlice({
  name: 'age',
  initialState: {
    age: 25,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ageUpAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(ageUpAsync.fulfilled, (state, action) => {
        state.age += action.payload
        state.loading = false
      })
      .addCase(ageUpAsync.rejected, (state) => {
        state.loading = false
      })
      .addCase(ageDownAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(ageDownAsync.fulfilled, (state, action) => {
        state.age = Math.max(0, state.age - action.payload)
        state.loading = false
      })
      .addCase(ageDownAsync.rejected, (state) => {
        state.loading = false
      })
  },
})

export default ageSlice.reducer
