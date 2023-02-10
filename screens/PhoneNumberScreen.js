import { StyleSheet, Image, View, TextInput, SafeAreaView, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import React, { useState, useRef, useEffect } from 'react'
import { firebaseConfig } from '../config';
import firebase from 'firebase/compat/app';

const PhoneNumberScreen = ({ navigation }) => {

    const [number, setNumber] = useState('')
    const numberInput = useRef(null)
    useEffect(() => {
        numberInput.current.focus();
    }, []);
    const isDisabled = !number.match(/^(?:\+\d{1,3}|\d{1,4})[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/)
    const [verificationId, setVerificationId] = useState();
    const recaptchaVerifier = useRef(null);
    useEffect(() => {
        if (verificationId) {
          navigation.navigate('VerificationScreen', { 
            paramKey: number, 
            vid: verificationId 
          });
        }
      }, [verificationId, navigation]);
      

    const sendVerification = () => {
        console.log("im here");
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(number, recaptchaVerifier.current)
            .then(setVerificationId);
        console.log(verificationId);
    };

    return (
        <SafeAreaView style={styles.container}>

            <View>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    size="invisible"
                />
                <View style={styles.tinyLogoContainer}>
                    <Image
                        style={styles.tinyLogo}
                        source={require('/Users/gracjanchmielnicki/newApp/assets/end-logo.png')}
                    />
                </View>
                <View>
                    <Text style={styles.header}>
                        one more thing to ask! {'\n'}
                        what is your phone number?
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <View style={{ width: '80%' }}>
                        <TextInput
                            ref={numberInput}
                            style={styles.inputPhone}
                            onChangeText={text => setNumber(text)}
                            value={number}
                            placeholder="phone number"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', width: '95%', alignSelf: 'center' }} behavior='padding' keyboardVerticalOffset={10}>
                <TouchableOpacity
                    onPress={sendVerification}
                    style={[styles.button, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                >
                    <Text style={[styles.buttonText, isDisabled && styles.disabledButtonText]}>Continue</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default PhoneNumberScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        //justifyContent: 'center',
        alignContent: 'center',
    },
    tinyLogo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    tinyLogoContainer: {
        alignItems: 'center',
    },
    inputPhone: {
        //width: '80%',
        height: 60,
        //width: 520,

        marginHorizontal: 5,
        backgroundColor: '#1F1F1F',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 40,
        borderColor: '#434343',
        borderWidth: 2,
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'flex-end'
    },
    buttonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center'
    },
    disabledButton: {
        backgroundColor: '#9B9B9B',
    },
    disabledButtonText: {
        color: '#F5F5F5',
    },

})