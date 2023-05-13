import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, TouchableOpacity, FlatList, Image, Modal, Button, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const GarmentsScreen = ({ route }) => {
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [alternative, setAlternative] = useState('')
    const [alternatives, setAlternatives] = useState([]);
    const [alternativeToDelete, setAlternativeToDelete] = useState(null);

    useEffect(() => {
        firebase.firestore().collection('posts').doc(postId).get()
            .then(doc => {
                if (doc.exists) {
                    setPost(doc.data());
                } else {
                    console.log("No such document!");
                }
            })
            .catch(error => console.log(error));
    }, [postId]);

    const fetchAlternatives = async () => {
        try {
            const alternativesSnapshot = await firebase.firestore().collection('posts').doc(postId).collection('alternatives').get();
            const alternativesData = alternativesSnapshot.docs.map(async doc => {
                const alternativeData = doc.data();
                const userData = await firebase.firestore().collection('users').doc(alternativeData.uid).get();
                const userDataValue = userData.data();
                return {
                    ...alternativeData,
                    username: userDataValue.username, // Replace 'username' with the actual field name in the users collection for username
                    userProfilePicture: userDataValue.profilePicture, // Replace 'profilePicture' with the actual field name in the users collection for profile picture
                    alternativeId: doc.id,
                };
            });
            Promise.all(alternativesData).then(result => {
                setAlternatives(result);
            });
        } catch (error) {
            console.error('Error fetching alternatives from Firebase:', error);
        }
    };

    useEffect(() => {
        fetchAlternatives();
    }, [postId]);


    const addAlternative = async () => {

        try {
            // Generate a postId
            const alternativeId = firebase.firestore().collection('posts').doc(postId).collection('alternatives').doc().id;

            // Add relevant data to Firestore database
            await firebase.firestore().collection('posts').doc(postId).collection('alternatives').doc(alternativeId).set({
                uid: firebase.auth().currentUser.uid, // Replace with the user ID
                alternative: alternative,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setAlternative('');
            await fetchAlternatives();
            return alternativeId;
        } catch (error) {
            console.error('Error uploading alternative to Firebase:', error);
            return null;
        }
    };

    const deleteAlternative = async (alternativeId) => {
        try {
            console.log('Deleting alternative with ID:', alternativeId);
            console.log('Deleting alternative with uid:', firebase.auth().currentUser.uid);
            await firebase
                .firestore()
                .collection('posts')
                .doc(postId)
                .collection('alternative')
                .doc(alternativeId)
                .delete();
            await fetchAlternatives();
        } catch (error) {
            console.error('Error deleting alternative from Firebase:', error);
        }
    };

    const handleAlternativeLongPress = (alternativeId) => {
        console.log('Long pressed alternative with ID:', alternativeId);
        setAlternativeToDelete(alternativeId);
    };

    const handleDeletePress = async () => {
        if (alternativeToDelete) {
            const alternativeDoc = await firebase
                .firestore()
                .collection('posts')
                .doc(postId)
                .collection('alternatives')
                .doc(alternativeToDelete)
                .get();

            if (alternativeDoc.exists) {
                const alternativeData = alternativeDoc.data();
                const currentUserUid = firebase.auth().currentUser.uid;

                if (alternativeData.uid === currentUserUid) {
                    console.log('Deleting alternative with ID:', alternativeToDelete);
                    deleteAlternative(alternativeToDelete);
                } else {
                    console.log("You are not the author of this alternative.");
                }
            } else {
                console.log("Alternative does not exist.");
            }

            setAlternativeToDelete(null);
        }
    };

    const renderAlternativeItem = ({ item }) => {
        return (
            <TouchableOpacity onLongPress={() => handleAlternativeLongPress(item.alternativeId)}>
                <View style={styles.alternativeContainer}>
                    <Image source={{ uri: item.userProfilePicture }} style={styles.avatar} />
                    <View style={styles.alternativeContentContainer}>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.alternative}>{item.alternative}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };



    return (
        <SafeAreaView style={styles.container}>
            {post ? (
                <>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                        <View style={styles.rowContainer}>
                            <View style={styles.square}>
                                <Ionicons name={'arrow-up'} size={27} color={'white'} />
                            </View>
                            <View style={styles.linkContainer}>
                                <Text style={styles.text}>{post.toplink ? post.toplink : "Not provided"}</Text>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.square}>
                                <Ionicons name={'arrow-down'} size={27} color={'white'} />
                            </View>
                            <View style={styles.linkContainer}>
                                <Text style={styles.text}>{post.bottomlink ? post.bottomlink : "Not provided"}</Text>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.square}>
                                <Ionicons name={'add'} size={27} color={'white'} />
                            </View>
                            <View style={styles.linkContainer}>
                                <Text style={styles.text}>{post.accessorylink ? post.accessorylink : "Not provided"}</Text>
                            </View>
                        </View>
                        <View>
                            <FlatList
                                data={alternatives}
                                renderItem={renderAlternativeItem}
                                keyExtractor={item => item.alternativeId}
                                contentContainerStyle={styles.alternativesListContainer}
                            />
                        </View>
                        <View style={styles.buttonView}>
                            <View style={styles.searchView}>
                                <View style={styles.inputView}>
                                    <TextInput
                                        placeholder="Alternative"
                                        placeholderTextColor="#434343"
                                        onChangeText={text => setAlternative(text)}
                                        value={alternative}
                                        style={styles.inputText}
                                        keyboardAppearance='dark'
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.continue}
                                    onPress={addAlternative} // Call searchUsers function on button press
                                >
                                    <Ionicons name={'arrow-forward'} size={30} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Modal visible={alternativeToDelete !== null} animationType="slide" transparent={true}>
                            <View style={styles.deleteConfirmationContainer}>
                                <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginBottom: 20 }}>Are you sure you want to delete this alternative?</Text>
                                <Button title="Delete" onPress={handleDeletePress} />
                                <Button title="Cancel" onPress={() => setAlternativeToDelete(null)} />
                            </View>
                        </Modal>
                    </KeyboardAvoidingView>
                </>

            ) : (
                <Text style={styles.text}>Loading...</Text>
            )}
        </SafeAreaView>
    )
}

export default GarmentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    rowContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    square: {
        width: 50,
        height: 50,
        backgroundColor: '#434343',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
    linkContainer: {
        justifyContent: 'center',
        marginLeft: 20,
    },
    alternativesListContainer: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    buttonView: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 10,
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
    inputView: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'white',
    },
    inputText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        //textAlign: 'center',
    },
    username: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
    alternative: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Helvetica',
        marginTop: 2,
    },
    continue: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 15
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    alternativeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    alternativeContentContainer: {
        flex: 1,
        backgroundColor: '#1F1F1F',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
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


})