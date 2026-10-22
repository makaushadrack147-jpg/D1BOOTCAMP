import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Comment, Story } from "../../../../types/src/index"
import { apiRequest } from "../../api"

interface StoriesState {
  items: Story[]
  active: Story | null
  comments: Comment[]
  loading: boolean
  error: string | null
}

const initialState: StoriesState = {
  items: [],
  active: null,
  comments: [],
  loading: false,
  error: null,
}

export const fetchStories = createAsyncThunk<Story[], boolean | undefined>(
  "stories/fetch",
  (ownOnly) => apiRequest<Story[]>(`/stories${ownOnly ? "?own=true" : ""}`),
)

export const fetchStory = createAsyncThunk<Story, number>(
  "stories/fetchOne",
  (id) => apiRequest<Story>(`/stories/${id}`),
)

export const saveStory = createAsyncThunk<Story, { id: number; title: string; content: string }>(
  "stories/save",
  ({ id, title, content }) => apiRequest<Story>(`/stories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title, content }),
  }),
)

export const createStory = createAsyncThunk<Story, { title: string; content: string }>(
  "stories/create",
  (story) => apiRequest<Story>("/stories", {
    method: "POST",
    body: JSON.stringify(story),
  }),
)

export const removeStory = createAsyncThunk<number, number>(
  "stories/remove",
  async (id) => {
    await apiRequest<void>(`/stories/${id}`, { method: "DELETE" })
    return id
  },
)

export const fetchComments = createAsyncThunk<Comment[], number>(
  "stories/comments",
  (id) => apiRequest<Comment[]>(`/stories/${id}/comments`),
)

export const addComment = createAsyncThunk<Comment, { id: number; content: string }>(
  "stories/addComment",
  ({ id, content }) => apiRequest<Comment>(`/stories/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  }),
)

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    clearStories(state) {
      state.items = []
      state.active = null
      state.comments = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Stories could not be loaded."
      })
      .addCase(fetchStory.fulfilled, (state, action) => {
        state.active = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
        else state.items.unshift(action.payload)
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.active = action.payload
      })
      .addCase(saveStory.fulfilled, (state, action) => {
        state.active = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(removeStory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.active?.id === action.payload) state.active = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })
      .addCase(fetchComments.pending, (state) => {
        state.comments = []
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload)
      })
  },
})

export const { clearStories } = storiesSlice.actions
export default storiesSlice.reducer
