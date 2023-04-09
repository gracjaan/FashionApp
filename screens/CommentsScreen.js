import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { addComment } from '../redux/postsSlice';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { useSelector, useDispatch } from 'react-redux';

const CommentsScreen = ({ route }) => {
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([]);
    const { postId } = route.params
    const dispatch = useDispatch();

    const handleCommentSubmit = () => {
        // Dispatch addComment async thunk with the postId, uid (from Redux or wherever you get it), and the comment
        dispatch(
            addComment({ postId, uid: firebase.auth().currentUser.uid, comment }) // Replace 'yourUid' with the actual uid of the user
        );
        setComment('');
    };

    useEffect(() => {
        // Fetch comments data from Firestore
        const fetchComments = async () => {
            try {
                const commentsSnapshot = await firebase.firestore().collection('posts').doc(postId).collection('comments').get();
                const commentsData = commentsSnapshot.docs.map(async doc => {
                    const commentData = doc.data();
                    const userData = await firebase.firestore().collection('users').doc(commentData.uid).get();
                    const userDataValue = userData.data();
                    return {
                        ...commentData,
                        username: userDataValue.username, // Replace 'username' with the actual field name in the users collection for username
                        userProfilePicture: userDataValue.profilePicture // Replace 'profilePicture' with the actual field name in the users collection for profile picture
                    };
                });
                Promise.all(commentsData).then(result => {
                    setComments(result);
                });
            } catch (error) {
                console.error('Error fetching comments from Firebase:', error);
            }
        };
        fetchComments();
    }, [postId]);


    const addC = async () => {

        try {
            // Generate a postId
            const commentId = firebase.firestore().collection('posts').doc(postId).collection('comments').doc().id;

            // Add relevant data to Firestore database
            await firebase.firestore().collection('posts').doc(postId).collection('comments').doc(commentId).set({
                uid: firebase.auth().currentUser.uid, // Replace with the user ID
                comment: comment,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setComment('');
            return commentId;
        } catch (error) {
            console.error('Error uploading comment to Firebase:', error);
            return null;
        }
    };

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentContainer}>
                <Image source={{ uri: item.userProfilePicture }} style={styles.avatar} />
                <View style={styles.commentContentContainer}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.comment}>{item.comment}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                <View>
                    <FlatList
                        data={comments}
                        renderItem={renderCommentItem}
                        keyExtractor={item => item.commentId}
                        contentContainerStyle={styles.commentsListContainer}
                    />
                </View>
                <View style={styles.buttonView}>
                    <View style={styles.searchView}>
                        <View style={styles.inputView}>
                            <TextInput
                                maxLength={24}
                                placeholder="Comment"
                                placeholderTextColor="#434343"
                                onChangeText={text => setComment(text)}
                                value={comment}
                                style={styles.inputText}
                                keyboardAppearance='dark'
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.continue}
                            onPress={addC} // Call searchUsers function on button press
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
        textAlign: 'center',
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
})