import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { addComment } from '../redux/postsSlice';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { useSelector, useDispatch } from 'react-redux';

const CommentsScreen = ({ route }) => {
    const [comment, setComment] = useState('')
    const { postId } = route.params
    const dispatch = useDispatch();

    const handleCommentSubmit = () => {
        // Dispatch addComment async thunk with the postId, uid (from Redux or wherever you get it), and the comment
        dispatch(
            addComment({ postId, uid: firebase.auth().currentUser.uid, comment }) // Replace 'yourUid' with the actual uid of the user
        );
        setComment('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
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
                            onPress={handleCommentSubmit} // Call searchUsers function on button press
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
})