import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import { Image } from 'expo-image';

const FourthUser = ({ user, navigation }) => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const posts = [];
            for (const postId of user.inspo) {
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

    useEffect(() => {
        fetchPosts(); // Call the fetchPosts function
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {/* Render the user's "inspo" posts in a 3x3 grid */}
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

export default FourthUser;