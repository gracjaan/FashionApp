// src/redux/postsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';

// Fetch posts data from Firebase
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  // Fetch posts data from Firebase
  // You can replace this with your actual Firebase logic
  const response = await firebase.firestore().collection('posts').get();
  const postsData = await Promise.all(
    response.docs.map(async (doc) => {
      const data = doc.data();
      // Fetch username from users collection using UID
      const userSnapshot = await firebase.firestore().collection('users').doc(data.uid).get();
      const userData = userSnapshot.data();
      const username = userData ? userData.username : '';
      const profilePicture = userData ? userData.profilePicture : ''; // Use an empty string as username if userData is not available
      return { ...data, username, profilePicture };
    })
  );
  return postsData;
});

// Define the posts slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: { postsData: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.postsData = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
