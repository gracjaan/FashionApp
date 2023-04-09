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

// Add like to a post in Firebase
export const addLike = createAsyncThunk('posts/addLike', async ({ postId, uid }) => {
    // Add like to post in Firebase
    // You can replace this with your actual Firebase logic
    await firebase.firestore().collection('posts').doc(postId).update({
        likes: firebase.firestore.FieldValue.arrayUnion(uid),
    });
});

// Remove like from a post in Firebase
export const removeLike = createAsyncThunk('posts/removeLike', async ({ postId, uid }) => {
    // Remove like from post in Firebase
    // You can replace this with your actual Firebase logic
    await firebase.firestore().collection('posts').doc(postId).update({
        likes: firebase.firestore.FieldValue.arrayRemove(uid),
    });
});

export const addComment = createAsyncThunk('posts/addComment', async ({ postId, uid, comment }) => {
    // Add comment to post in Firebase
    // Generate a unique commentId
    const commentId = firebase.firestore().collection('posts').doc(postId).collection('comments').doc().id;
    // Update the comment data in the sub-collection
    await firebase.firestore().collection('posts').doc(postId).collection('comments').doc(commentId).set({ uid, comment, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return { commentId, uid, comment };
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
            })
            .addCase(addComment.fulfilled, (state, action) => {
                // Update comments array in postsData with the new comment
                const { postId, uid, comment } = action.meta.arg;
                const postIndex = state.postsData.findIndex((post) => post.postId === postId);
                if (postIndex !== -1) {
                  state.postsData[postIndex].comments.push({ uid, comment });
                }
              })
            .addCase(addLike.fulfilled, (state, action) => {
                // Update likes array in postsData with the new like
                const { postId, uid } = action.meta.arg;
                const postIndex = state.postsData.findIndex((post) => post.postId === postId);
                if (postIndex !== -1) {
                    state.postsData[postIndex].likes.push(uid);
                }
            })
            .addCase(removeLike.fulfilled, (state, action) => {
                // Update likes array in postsData by removing the like
                const { postId, uid } = action.meta.arg;
                const postIndex = state.postsData.findIndex((post) => post.postId === postId);
                if (postIndex !== -1) {
                    state.postsData[postIndex].likes = state.postsData[postIndex].likes.filter(
                        (like) => like !== uid
                    );
                }
            });
    },
});

export default postsSlice.reducer;
