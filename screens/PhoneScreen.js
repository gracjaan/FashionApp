import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import PhoneInput from "react-native-phone-number-input";
import { firebaseConfig } from '../config';
import firebase from 'firebase/compat/app';
import ContinueButton from '../comp/ContinueButton';

const PhoneScreen = ({ navigation }) => {
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const phoneInput = useRef(null);
    const isDisabled = !phoneInput.current?.isValidNumber(value);
    const [verificationId, setVerificationId] = useState();
    const recaptchaVerifier = useRef(null);

    useEffect(() => {
        if (verificationId) {
            navigation.navigate('OtpScreen', {
                paramKey: formattedValue,
                vid: verificationId
            });
        }
    }, [verificationId, navigation]);


    const sendVerification = () => {
        console.log(formattedValue);
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(formattedValue, recaptchaVerifier.current)
            .then(setVerificationId);
        console.log(verificationId);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                    <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={firebaseConfig}
                        size="invisible"
                    />
                    <View style={{ marginTop: 40, }}>
                        <Text style={styles.description}>one more thing to ask! {'\n'} what is your phone number? </Text>
                    </View>
                    <View style={{ alignSelf: 'center', marginTop: 40, }}>
                        <PhoneInput
                            ref={phoneInput}
                            defaultValue={value}
                            defaultCode="PL"
                            layout="first"
                            onChangeText={(text) => { setValue(text) }}
                            onChangeFormattedText={(text) => { setFormattedValue(text) }}
                            withDarkTheme
                            withShadow
                            autoFocus
                            containerStyle={styles.phoneInput}
                            textContainerStyle={{ backgroundColor: '#1F1F1F', borderRadius: 10 }}
                            textInputStyle={styles.phoneInputText}
                            codeTextStyle={styles.phoneInputText}
                        />
                    </View>
                    <View style={styles.buttonView}>
                        <ContinueButton onPress={sendVerification} isDisabled={isDisabled} />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default PhoneScreen

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
    recaptchaView: {
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    phoneInput: {
        width: 300,
        height: 60,
        alignSelf: 'center',
        backgroundColor: '#1F1F1F',
        borderRadius: 10,
        borderColor: '#434343',
        borderWidth: 2,
    },
    phoneInputText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
})