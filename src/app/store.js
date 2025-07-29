import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../features/appSlice"
import postReducer from "../features/postSlice"
import followReducer from "../features/followSlice"
 import singlePostReducer from "../features/singlePostSlice"
 import messageReducer from "../features/messageSlice"

export const store = configureStore({
    reducer: {
        app: appReducer,
        posts: postReducer,
        follows: followReducer,
        singlePost: singlePostReducer,
        message: messageReducer
    },
  devTools: true
})