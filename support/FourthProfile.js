import { View, Image, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import UserContext from '../context/UserContext';

const FourthProfile = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const { currentUser } = useContext(UserContext);

    const fetchPosts = async () => {
        try {
            const posts = [];
            for (const postId of currentUser.inspo) {
                const postRef = firebase.firestore().collection('posts').doc(postId);
                const postDoc = await postRef.get();
                if (postDoc.exists) {
                    const post = {postId: postDoc.id, ...postDoc.data()};
                    posts.push(post);
                }
            }

            const uniquePosts = Array.from(new Set(posts.map(post => post.postId))).map(postId => {
                return posts.find(post => post.postId === postId);
            });

            const sortedPosts = uniquePosts.sort((a, b) => b.timestamp - a.timestamp);
            console.log('1 '+sortedPosts.length)
            setPosts(sortedPosts);
            console.log('2 '+posts.length)
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const removeItemFromInspo = async (postId) => {
        try {
          const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
          await userRef.update({
            inspo: firebase.firestore.FieldValue.arrayRemove(postId),
          });
          console.log('Item removed from inspo list');

          currentUser.inspo = currentUser.inspo.filter((item) => item !== postId);
    
          fetchPosts(); // Refresh the posts after removing the item
        } catch (error) {
          console.error('Error removing item from inspo list:', error);
        }
      };

      const handleDelete = (postId) => {
        Alert.alert(
            'Remove inspo',
            'Are you sure you want to remove this inspo?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeItemFromInspo(postId),
                },
            ],
        );
    };

    useEffect(() => {
        fetchPosts(); // Call the fetchPosts function
    }, [currentUser.inspo]);

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

                keyExtractor={(item) => item.postId}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

export default FourthProfile;