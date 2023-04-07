import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import store from '../redux/store';
import { useSelector } from 'react-redux';

const OtpScreen = ({ navigation, route }) => {
    const verificationId = route.params.vid;
    const [codeInput, setCodeInput] = useState('');
    const isDisabled = codeInput.length < 6;

    const addUserToFirestore = (uid) => {
        const state = store.getState(); // Access the current state of the Redux store
        const { name, username, dateOfBirth, profilePicture } = state.user; // Destructure the values from the user reducer
    
        // Check if user already exists in Firestore
        firebase.firestore().collection('users').doc(uid).get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    console.log('User already exists in Firestore:', docSnapshot.data());
                    // User already exists, do not add again
                } else {
                    // User does not exist, add to Firestore
                    firebase.firestore().collection('users').doc(uid).set({
                        name: name,
                        username: username,
                        dateOfBirth: dateOfBirth,
                        profilePicture: profilePicture,
                    })
                        .then(() => {
                            console.log('User added to Firestore successfully!');
                        })
                        .catch((error) => {
                            console.error('Error adding user to Firestore:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error checking if user exists in Firestore:', error);
            });
    };

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            codeInput
        );
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                //add user to firestore
                store.dispatch({ type: 'UPDATE_UID', payload: firebase.auth().currentUser.uid })
                const state = store.getState();
                console.log(store.getState());
                addUserToFirestore(firebase.auth().currentUser.uid);
                navigation.navigate('Home')
            })
            .catch((error) => {
                //show an alert
                Alert.alert('Invalid code', 'Please enter a valid code and try again.')
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                    <View style={{ marginTop: 40, }}>
                        <Text style={styles.description}>seems like we're friends now! {'\n'} just confirm it's you </Text>
                    </View>
                    <OTPInputView
                        style={{ width: '90%', height: 200, alignSelf: 'center' }}
                        pinCount={6}
                        keyboardAppearance='dark'
                        autoFocusOnLoad
                        selectionColor='transparent'
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeChanged={(code => {
                            setCodeInput(code);
                        })}
                    />
                    <View style={styles.buttonView}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.smallText}>Change phone number</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirmCode}
                            style={[styles.continue, { backgroundColor: isDisabled ? '#9B9B9B' : 'white' }]}
                            disabled={isDisabled}
                        >
                            <Text style={[styles.description, { margin: 15, color: isDisabled ? '#F5F5F5' : 'black' }]}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default OtpScreen

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
    borderStyleHighLighted: {
        borderColor: 'white',
    },

    underlineStyleBase: {
        width: 50,
        height: 60,
        borderWidth: 2,
        borderColor: '#434343',
        borderRadius: 10,
        backgroundColor: '#1F1F1F',
        //text properites
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },

    underlineStyleHighLighted: {
        borderColor: "white",
    },
    smallText: {
        color: 'grey',
        fontSize: 16,
        fontFamily: 'Helvetica',
        textAlign: 'center',
        marginBottom: 20
    }
})