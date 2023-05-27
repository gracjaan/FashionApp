import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import { Image } from 'expo-image';

const FirstUser = ({ user, navigation }) => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const posts = [];
            for (const postId of user.posts) {
                const postRef = firebase.firestore().collection('posts').doc(postId);
                const postDoc = await postRef.get();
                if (postDoc.exists) {
                    const post = { postId: postDoc.id, ...postDoc.data() };
                    posts.push(post);
                }
            }
            const sortedPosts = posts.sort((a, b) => b.timestamp - a.timestamp);
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts(); // Call the fetchPosts function
    }, [user]);

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

export default FirstUser;