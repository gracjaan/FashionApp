import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Image, Keyboard, TouchableOpacity, TextInput, Button, Alert, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import * as ImageManipulator from 'expo-image-manipulator';



const EditProfileScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [profilePicturedb, setProfilePicturedb] = useState('');
    const [usernamedb, setUsernamedb] = useState('');
    const [namedb, setNamedb] = useState('');
    const [postsdb, setPostsdb] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const updateProfile = async () => {
        try {
            const user = firebase.auth().currentUser; // Get the current user

            if (image) {
                // If image is not null, upload it to Firebase and get the download URL
                const downloadUrl = await uploadImageToFirebase(image);

                // Update the profile picture field with the download URL
                await firebase.firestore().collection('users').doc(user.uid).update({
                    profilePicture: downloadUrl,
                });
            }

            // Update the name and username fields with the new values from state
            await firebase.firestore().collection('users').doc(user.uid).update({
                name: namedb,
                username: usernamedb,
            });

            // Update the attributes of each post
            await updatePosts();

            console.log('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const updatePosts = async () => {
        try {
            const updatePromises = postsdb.map(async (postId) => {
                const postRef = firebase.firestore().collection('posts').doc(postId);
                const postDoc = await postRef.get();

                if (postDoc.exists) {
                    await postRef.update({
                        username: usernamedb,
                        profilePicture: profilePicturedb,
                    });
                }
            });

            await Promise.all(updatePromises);
            console.log('All posts updated successfully!');
        } catch (error) {
            console.error('Error updating posts:', error);
        }
    };


    const compressAndResizeImage = async (uri) => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 150, height: 150 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            return manipResult.uri;
        } catch (error) {
            console.log('Error compressing image:', error);
            throw error;
        }
    };



    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Save Changes',
                        'Are you sure you want to save the changes?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Save',
                                onPress: () => {
                                    updateProfile();
                                    setShowPopup(true);
                                    setTimeout(() => {
                                        setShowPopup(false);
                                    }, 1200);
                                },
                                style: 'default',
                            },
                        ],
                        { cancelable: false }
                    );
                }}>
                    <Text style={{ color: "white", marginRight: 10, fontFamily: 'Helvetica', fontSize: 20 }}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, updateProfile]);

    const fetchUserData = async () => {
        try {
            const user = firebase.auth().currentUser; // Get the current user
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get(); // Fetch the user's document from the 'users' collection
            if (userDoc.exists) {
                const userData = userDoc.data(); // Get the data from the user's document
                const profilePictureUrl = userData.profilePicture; // Get the profile picture URL from the user's data
                const username = userData.username;
                const name = userData.name; // Get the username from the user's data
                const posts = userData.posts;
                setProfilePicturedb(profilePictureUrl); // Update the state with the retrieved profile picture URL
                setUsernamedb(username);
                setNamedb(name);  // Update the state with the retrieved username
                setPostsdb(posts);
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };

    useEffect(() => {
        fetchUserData(); // Call the fetchProfilePicture function
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const storageRef = firebase.storage().ref();

    const uploadImageToFirebase = async (uri) => {
        const compressedUri = await compressAndResizeImage(uri);
        const response = await fetch(compressedUri);
        const blob = await response.blob();
        const filename = Date.now().toString(); // Use a unique filename
        const imageRef = storageRef.child(`images/${filename}`);

        try {
            await imageRef.put(blob);
            const downloadUrl = await imageRef.getDownloadURL();
            console.log(`Image uploaded to Firebase: ${downloadUrl}`);
            return downloadUrl;
        } catch (error) {
            console.error('Error uploading image to Firebase:', error);
            return null;
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        navigation.navigate('NameScreen');
                        firebase.auth().signOut();
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            {image ? (
                                // If image is not null, render the selected image
                                <Image style={styles.avatar} source={{ uri: image }} />
                            ) : (
                                // If image is null, render the profile picture from state
                                <Image style={styles.avatar} source={{ uri: profilePicturedb }} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.topText}>Name</Text>
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="#434343"
                            onChangeText={text => setNamedb(text)}
                            value={namedb}
                            style={styles.bottomText}
                            keyboardAppearance='dark'
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.topText}>Username</Text>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#434343"
                            onChangeText={text => setUsernamedb(text)}
                            value={usernamedb}
                            style={styles.bottomText}
                            keyboardAppearance='dark'
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showPopup}
                onRequestClose={() => setShowPopup(false)}
            >
                <View style={styles.popupContainer}>
                    <View style={styles.popup}>
                        <Ionicons name="checkmark-circle-outline" size={100} color="black" />
                        <Text style={styles.popupText}>Profile saved successfully!</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatar: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
        borderRadius: 100,
    },
    textContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#1F1F1F',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    topText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
    bottomText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Helvetica',
        marginTop: 2,
    },
    logoutButton: {
        alignSelf: 'center',
        marginBottom: 20,
        flex: 1,
        justifyContent: 'flex-end',
    },
    logoutButtonText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    popupText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})