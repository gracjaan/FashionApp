import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import postsReducer from './postsSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
    }
})