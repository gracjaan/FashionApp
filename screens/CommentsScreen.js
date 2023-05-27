import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, ActivityIndicator, TextInput, Keyboard, TouchableOpacity, FlatList, Image, Modal, Button, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import UserContext from '../context/UserContext';

const CommentsScreen = ({ route }) => {
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([]);
    const { postId } = route.params
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useContext(UserContext);

    // Fetch comments data from Firestore
    const fetchComments = async () => {
        try {
            const snapshot = await firebase
                .firestore()
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .get();

            const comments = snapshot.docs.map(doc => ({
                commentId: doc.id,
                ...doc.data(),
            }));

            setComments(comments);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);


    const addComment = async () => {

        try {
            // Generate a postId
            const commentId = firebase.firestore().collection('posts').doc(postId).collection('comments').doc().id;

            // Add relevant data to Firestore database
            await firebase.firestore().collection('posts').doc(postId).collection('comments').doc(commentId).set({
                uid: currentUser.uid, // Replace with the user ID
                username: currentUser.username, // Replace with the user's username
                profilePicture: currentUser.profilePicture, // Replace with the user's profile picture URL
                comment: comment, // Replace with the comment state value
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(), // Replace with the current UNIX timestamp
            });

            setComment('');
            await fetchComments();
            return commentId;
        } catch (error) {
            console.error('Error uploading comment to Firebase:', error);
            return null;
        }
    };

    const deleteComment = async (commentId) => {
        try {
            // Delete the comment from Firestore
            await firebase
                .firestore()
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .doc(commentId)
                .delete();

            // Refetch the comments from Firestore
            await fetchComments();
        } catch (error) {
            console.error('Error deleting comment from Firebase:', error);
        }
    };

    const handleCommentLongPress = (commentId) => {
        Alert.alert(
            'Delete comment?',
            'Are you sure you want to delete this comment?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteComment(commentId);
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );

    };

    const renderCommentItem = ({ item }) => {
        return (
            <TouchableOpacity onLongPress={() => handleCommentLongPress(item.commentId)}>
                <View style={styles.commentContainer}>
                    <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
                    <View style={styles.commentContentContainer}>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.comment}>{item.comment}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderComments = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#aaa" />
                </View>
            );
        } else if (comments.length === 0) {
            return (
                <View style={styles.noCommentsContainer}>
                    <Ionicons name="chatbubble-ellipses-outline" size={100} color="#aaa" style={{ marginBottom: 10 }} />
                    <Text style={styles.noCommentsText}>no comments yet. {"\n"} be the first one.</Text>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.commentId}
                    contentContainerStyle={styles.commentsListContainer}
                />
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                {renderComments()}
                <View style={styles.buttonView}>
                    <View style={styles.searchView}>
                        <View style={styles.inputView}>
                            <TextInput
                                placeholder="comment."
                                placeholderTextColor="#434343"
                                onChangeText={text => setComment(text)}
                                value={comment}
                                style={styles.inputText}
                                keyboardAppearance='dark'
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.continue}
                            onPress={addComment} // Call searchUsers function on button press
                        >
                            <Ionicons name={'arrow-forward'} size={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default CommentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    description: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputView: {
        height: 60,
        width: '80%',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#1F1F1F',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 40,
        borderColor: '#434343',
        borderWidth: 2,
        color: 'white',
    },
    inputText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        //textAlign: 'center',
    },
    buttonView: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 10,
    },
    continue: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    searchView: {
        height: 50,
        marginTop: 20,
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#1F1F1F',
        paddingLeft: 15,
        paddingRight: 6,
        //paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#434343',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continue: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 15
    },
    inputView: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'white',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContentContainer: {
        flex: 1,
        backgroundColor: '#1F1F1F',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    username: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
    comment: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Helvetica',
        marginTop: 2,
    },
    commentsListContainer: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    deleteConfirmationContainer: {
        //flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 200,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        //marginVertical: 300,

    },
    noCommentsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCommentsText: {
        color: 'grey',
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'regular',
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 10,
    },
})