import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserContext from '../context/UserContext';
import { Image } from 'expo-image';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/auth';


const PostItem = ({ item, navigation }) => {

    const { currentUser } = useContext(UserContext);

    const timestamp = item.timestamp.toDate();

    // Format the date as "DD.MM.YYYY"
    const formattedDate = timestamp.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedTime = timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric'
    });

    // Function to handle toggling the like action
    const toggleLike = async () => {
        try {
            const postRef = firebase.firestore().collection('posts').doc(item.postId);
            const postDoc = await postRef.get();

            if (postDoc.exists) {
                const post = postDoc.data();
                const likedByUser = post.likes.includes(currentUser.uid);

                if (likedByUser) {
                    // Remove the user's UID from the likes array
                    await postRef.update({
                        likes: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
                    });
                } else {
                    // Add the user's UID to the likes array
                    await postRef.update({
                        likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
                    });
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const [isInspired, setIsInspired] = useState(currentUser.inspo.includes(item.postId));

    // Function to handle toggling the bookmark action
    const toggleBookmark = async () => {
        try {
            const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                const user = userDoc.data();
                const isInspired = user.inspo.includes(item.postId);

                if (isInspired) {
                    // Remove the post's ID from the inspo array
                    await userRef.update({
                        inspo: firebase.firestore.FieldValue.arrayRemove(item.postId),
                    });

                    currentUser.inspo = currentUser.inspo.filter((postId) => postId !== item.postId);

                } else {
                    // Add the post's ID to the inspo array
                    await userRef.update({
                        inspo: firebase.firestore.FieldValue.arrayUnion(item.postId),
                    });

                    currentUser.inspo.push(item.postId);

                }
                console.log(currentUser.inspo);
                setIsInspired(!isInspired);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    useEffect(() => {
        // Update the isInspired state when the currentUser changes
        setIsInspired(currentUser.inspo.includes(item.postId));
    }, [currentUser]);

    return (
        <View style={styles.cardView}>
            <View style={styles.topCard}>
                <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { uid: item.uid })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={styles.avatar} source={{ uri: item.profilePicture }} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.nickname}>{item.username}</Text>
                            <Text style={styles.date}>{formattedDate} · {formattedTime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <Image style={styles.image} source={{ uri: item.imageUrl }} />
            </View>
            <View style={[styles.topCard, { justifyContent: 'space-between', marginBottom: 5 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={toggleLike}>
                        <Ionicons
                            name={item.likes.includes(currentUser.uid) ? 'heart' : 'heart-outline'}
                            size={28}
                            color={item.likes.includes(currentUser.uid) ? '#fb3959' : 'white'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('CommentsScreen', { postId: item.postId })}>
                        <Ionicons name={'chatbubble-outline'} size={25} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={toggleBookmark}>
                        <Ionicons
                            name={isInspired ? 'bookmark' : 'bookmark-outline'}
                            size={25}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('GarmentsScreen', { postId: item.postId })}>
                        <Ionicons name={'shirt-outline'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginHorizontal: 10 }}>
                {item.description && (
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.nickname}>{item.username}: </Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
                <Text style={styles.description}>liked by {item.likes.length} fashion icons.</Text>
            </View>
        </View>
    )
}

export default PostItem

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