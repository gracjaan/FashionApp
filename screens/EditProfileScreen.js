import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Image, Keyboard, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';


const EditProfileScreen = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [profilePicturedb, setProfilePicturedb] = useState('');
    const [usernamedb, setUsernamedb] = useState('');

    useEffect(() => {
        // Fetch the user's profile picture from Firebase
        const fetchProfilePicture = async () => {
            try {
                const user = firebase.auth().currentUser; // Get the current user
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get(); // Fetch the user's document from the 'users' collection
                if (userDoc.exists) {
                    const userData = userDoc.data(); // Get the data from the user's document
                    const profilePictureUrl = userData.profilePicture; // Get the profile picture URL from the user's data
                    const username = userData.username; // Get the username from the user's data
                    setProfilePicturedb(profilePictureUrl); // Update the state with the retrieved profile picture URL
                    setUsernamedb(username); // Update the state with the retrieved username
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchProfilePicture(); // Call the fetchProfilePicture function
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
                        <Text style={styles.topText}>Username</Text>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#434343"
                            onChangeText={text => setUsername(text)}
                            value={username}
                            style={styles.bottomText}
                            keyboardAppearance='dark'
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.topText}>Name</Text>
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="#434343"
                            onChangeText={text => setName(text)}
                            value={name}
                            style={styles.bottomText}
                            keyboardAppearance='dark'
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
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
})