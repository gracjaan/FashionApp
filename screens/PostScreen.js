import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/auth';

const PostScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);
    const [inspo, setInspo] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [postId]);

    const fetchPosts = async () => {
        try {
          const postRef = firebase.firestore().collection('posts').doc(postId);
          const postDoc = await postRef.get();
      
          if (postDoc.exists) {
            const postData = postDoc.data();
      
            const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
            const userDoc = await userRef.get();
      
            if (userDoc.exists) {
              const userData = userDoc.data();
              setInspo(userData.inspo.includes(postId));
            }
      
            const username = await getUsername(postData.uid);
            const profilePicture = await getProfilePicture(postData.uid);
            const postDataWithUser = { ...postData, username, profilePicture };
      
            setPost(postDataWithUser);
      
            if (postData.likes.includes(firebase.auth().currentUser.uid)) {
              setLiked(true);
            }
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.log('Error fetching posts:', error);
        }
      };
      

    const toggleLike = async () => {
        console.log('Toggling like!');
        try {
            const postRef = firebase.firestore().collection('posts').doc(postId);

            if (liked) {
                await postRef.update({
                    likes: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
                });
                setLiked(false);
            } else {
                await postRef.update({
                    likes: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
                });
                setLiked(true);
            }
        } catch (error) {
            console.log('Error toggling like:', error);
        }
    };

    const toggleInspo = async () => {
        console.log('Toggling inspo!');
        try {
            const uid = firebase.auth().currentUser.uid;
            const userRef = firebase.firestore().collection('users').doc(uid);

            if (inspo) {
                await userRef.update({
                    inspo: firebase.firestore.FieldValue.arrayRemove(postId)
                });
                setInspo(false);
            } else {
                await userRef.update({
                    inspo: firebase.firestore.FieldValue.arrayUnion(postId)
                });
                setInspo(true);
            }
        } catch (error) {
            console.log('Error toggling inspo:', error);
        }
    };



    const getUsername = async (uid) => {
        try {
            const userSnapshot = await firebase.firestore().collection('users').doc(uid).get();
            if (userSnapshot.exists) {
                const userData = userSnapshot.data();
                return userData.username;
            }
            return '';
        } catch (error) {
            console.log('Error fetching username:', error);
            return '';
        }
    };

    const getProfilePicture = async (uid) => {
        try {
            const userSnapshot = await firebase.firestore().collection('users').doc(uid).get();
            if (userSnapshot.exists) {
                const userData = userSnapshot.data();
                return userData.profilePicture;
            }
            return '';
        } catch (error) {
            console.log('Error fetching profile picture:', error);
            return '';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {post ? (
                <View style={styles.cardView}>
                    <View style={styles.topCard}>
                        <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { uid: post.uid })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image style={styles.avatar} source={{ uri: post.profilePicture }} />
                                <Text style={styles.nickname}>{post.username}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Image style={styles.image} source={{ uri: post.imageUrl }} />
                    </View>
                    <View style={[styles.topCard, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => toggleLike()} >
                                <Ionicons
                                    name={'heart'}
                                    size={30}
                                    color={liked ? 'red' : 'white'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('CommentsScreen', { postId: post.postId })}>
                                <Ionicons name={'chatbubble'} size={27} color={'white'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => toggleInspo()}>
                                <Ionicons name={'paper-plane'} size={27} color={inspo ? 'blue' : 'white'} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <Ionicons name={'shirt'} size={27} color={'white'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </SafeAreaView>
    )
}

export default PostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    image: {
        width: '98%',
        height: 400,
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
        marginBottom: 40,
        width: '100%',
        height: 530,
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
        fontSize: 17,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10,
    },
})