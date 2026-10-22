import { configureStore } from "@reduxjs/toolkit"
import { configureApi } from "../api"
import authReducer, { clearSession, setSession } from "../features/auth/authSlice"
import storiesReducer, { clearStories } from "../features/stories/storiesSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stories: storiesReducer,
  },
})

configureApi(
  () => store.getState().auth.accessToken,
  (session) => store.dispatch(setSession(session)),
  () => {
    store.dispatch(clearSession())
    store.dispatch(clearStories())
  },
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
