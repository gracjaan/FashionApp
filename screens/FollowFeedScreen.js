import { View, Text, SafeAreaView, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Ionicons } from '@expo/vector-icons';
import 'firebase/compat/firestore';
import 'firebase/auth';
import { Image } from 'expo-image';
import PostItem from '../comp/PostItem';


const FollowFeedScreen = ({ navigation }) => {
    const [postsData, setPostsData] = useState([]);
    const [lastDocument, setLastDocument] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);

            // Retrieve the UID of the currently logged-in user
            const currentUserUID = firebase.auth().currentUser.uid;

            // Fetch the 'following' array from the 'users' collection for the logged-in user
            const userSnapshot = await firebase.firestore()
                .collection('users')
                .doc(currentUserUID)
                .get();

            const following = userSnapshot.data().following;

            // Set the query to fetch posts from followed accounts
            let query = firebase.firestore()
                .collection('posts')
                .where('uid', 'in', following)
                .orderBy('timestamp', 'desc')
                .limit(10);

            // If there's a last document, fetch posts after that document
            if (lastDocument) {
                query = query.startAfter(lastDocument);
            } else {
                // Reset the posts data when lastDocument is null
                setPostsData([]);
            }

            const snapshot = await query.get();

            const newPosts = snapshot.docs.map(doc => ({
                postId: doc.id,
                ...doc.data()
            }));

            // Update the last document
            if (snapshot.docs.length > 0) {
                setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
            } else {
                setLastDocument(null);
            }

            // Append the new posts to the existing posts
            setPostsData(prevPosts => [...prevPosts, ...newPosts]);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshPosts = async () => {
        try {
            setIsRefreshing(true);
            await fetchPosts();
        } catch (error) {
            console.error('Error refreshing posts:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Load more posts when reaching the end of the list
    const loadMoreItems = () => {
        if (!isLoading && lastDocument) {
            fetchPosts();
        }
    };

    useEffect(() => {
        // Fetch initial posts
        fetchPosts();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <PostItem
                item={item}
                navigation={navigation}
            />
        );
    };

    const renderLoader = () => {
        return (
            isLoading ? (
                <View style={styles.loaderStyle}>
                    <ActivityIndicator size="large" color="#aaa" />
                </View>
            ) : null
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={postsData}
                keyExtractor={item => item.postId}
                renderItem={renderItem}
                ListFooterComponent={isLoading && renderLoader}
                onEndReached={loadMoreItems}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={refreshPosts}
                        colors={['#aaa']} // Customize the refresh indicator colors if needed
                    />
                }
            />
        </SafeAreaView>
    );
};


export default FollowFeedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    image: {
        width: '98%',
        aspectRatio: 1,
        resizeMode: 'cover',
        borderRadius: 10,
        alignSelf: 'center'
    },
    avatar: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        borderRadius: 100
    },
    cardView: {
        marginBottom: 20,
        width: '100%',
        alignSelf: 'center',
    },
    topCard: {
        flexDirection: 'row',
        margin: 15,
        alignItems: 'center',
        width: '95%',
        alignSelf: 'center',
    },
    nickname: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        //textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 10,
    },
    loaderStyle: {
        marginVertical: 16,
        alignItems: "center",
    },
    date: {
        color: 'grey',
        fontSize: 12,
        fontFamily: 'Helvetica',
        fontWeight: 'regular',
        //textAlign: 'center',
    },
    description: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Helvetica',
        fontWeight: 'regular',
        //textAlign: 'center',
    }
})
