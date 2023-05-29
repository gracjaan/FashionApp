import { View, Image, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import UserContext from '../context/UserContext';

const FirstProfile = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const { currentUser } = useContext(UserContext);

    const fetchPosts = async () => {
        try {
            const posts = [];
            for (const postId of currentUser.posts) {
                const postRef = firebase.firestore().collection('posts').doc(postId);
                const postDoc = await postRef.get();
                if (postDoc.exists) {
                    const post = {postId: postDoc.id, ...postDoc.data()};
                    posts.push(post);
                }
            }
            const sortedPosts = posts.sort((a, b) => b.timestamp - a.timestamp);
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const deletePost = async (postId) => {
        try {
            // Delete the image from storage
            const postRef = firebase.firestore().collection('posts').doc(postId);
            const postDoc = await postRef.get();
            if (postDoc.exists) {
                const imageUrl = postDoc.data().imageUrl;
                const imageRef = firebase.storage().refFromURL(imageUrl);
                await imageRef.delete();
            }

            // Delete the post from the database
            await postRef.delete();

            // Remove the post from the user collection
            const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
            await userRef.update({
                posts: firebase.firestore.FieldValue.arrayRemove(postId)
            });

            // Remove the post from the current user object
            currentUser.posts = currentUser.posts.filter((item) => item !== postId);

            // Refetch the posts
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleDelete = (postId) => {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deletePost(postId),
                },
            ],
        );
    };

    useEffect(() => {
        console.log('FirstProfile useEffect');
        fetchPosts(); // Call the fetchPosts function
    }, [currentUser.posts]);

    return (
        <View style={{ flex: 1, backgroundColor: 'black', }}>
            {/* Render the user's posts in a 3x3 grid */}
            <FlatList
                data={posts}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            width: '33.33%', // Set a fixed width for each item (3 items in a row)
                            aspectRatio: 1, // Maintain the aspect ratio of the image
                        }}
                        onPress={() => navigation.navigate('PostScreen', { item: item })}
                        onLongPress={() => handleDelete(item.postId)} // Handle long press to delete
                    >
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </TouchableOpacity>
                )}

                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

export default FirstProfile;