import { StyleSheet, Image, View, TextInput, SafeAreaView, Text, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import firebase from 'firebase/compat/app';

const VerificationScreen = ({ navigation , route }) => {

    const verificationId = route.params.vid;

    const [one, setOne] = useState('')
    const [two, setTwo] = useState('')
    const [three, setThree] = useState('')
    const [four, setFour] = useState('')
    const [five, setFive] = useState('')
    const [six, setSix] = useState('')
    const code = one + two + three + four + five + six;
    
    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
            .catch((error) => {
                //show an alert
                alert(error);
            })
        Alert.alert(
            'Login successful. Welcome to dashboard'
        );
        navigation.navigate('ProfileScreen')
    }

    const oneInput = useRef(null)

    useEffect(() => {
        oneInput.current.focus();
    }, []);

    const twoInput = useRef(null)
    const threeInput = useRef(null)
    const fourInput = useRef(null)
    const fiveInput = useRef(null)
    const sixInput = useRef(null)

    const handleOne = (text) => {
        setOne(text)
        if (text.length === 1) {
            twoInput.current.focus()
        }
    }

    const handleTwo = (text) => {
        setTwo(text)
        if (text.length === 1) {
            threeInput.current.focus()
        }
    }

    const handleThree = (text) => {
        setThree(text)
        if (text.length === 1) {
            fourInput.current.focus()
        }
    }
    const handleFour = (text) => {
        setFour(text)
        if (text.length === 1) {
            fiveInput.current.focus()
        }
    }
    const handleFive = (text) => {
        setFive(text)
        if (text.length === 1) {
            sixInput.current.focus()
        }
    }
    const handlePress = () => {
        if (one.length === 1 && two.length === 1 && three.length === 1 && four.length === 1) {
            //navigate to next screen
            navigation.navigate('ProfileScreen')
        } else {
            alert('Please enter a valid date')
        }
    }

    const isDisabled = one.length !== 1 || two.length !== 1 || three.length !== 1 || four.length !== 1;

    return (
        <SafeAreaView style={styles.container}>

            <View>
                <View style={styles.tinyLogoContainer}>
                    <Image
                        style={styles.tinyLogo}
                        source={require('/Users/gracjanchmielnicki/newApp/assets/end-logo.png')}
                    />
                </View>
                <View>
                    <Text style={styles.header}>
                        seems like we're friends now! {'\n'}
                        just confirm it's you
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                    <View>
                        <TextInput
                            ref={oneInput}
                            style={styles.input}
                            onChangeText={handleOne}
                            value={one}
                            maxLength={1}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View>
                        <TextInput
                            ref={twoInput}
                            style={styles.input}
                            onChangeText={handleTwo}
                            value={two}
                            maxLength={1}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View>
                        <TextInput
                            ref={threeInput}
                            style={styles.input}
                            onChangeText={handleThree}
                            value={three}
                            maxLength={1}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View>
                        <TextInput
                            ref={fourInput}
                            style={styles.input}
                            onChangeText={handleFour}
                            value={four}
                            maxLength={1}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View>
                        <TextInput
                            ref={fiveInput}
                            style={styles.input}
                            onChangeText={handleFive}
                            value={five}
                            maxLength={1}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View>
                        <TextInput
                            ref={sixInput}
                            style={styles.input}
                            onChangeText={text => setSix(text)}
                            value={six}
                            maxLength={1}
                            keyboardType="number-pad"
                        />
                    </View>

                </View>
            </View>
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', width: '95%', alignSelf: 'center' }} behavior='padding' keyboardVerticalOffset={10}>
                <TouchableOpacity
                    onPress={confirmCode}
                    style={[styles.button, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                >
                    <Text style={[styles.buttonText, isDisabled && styles.disabledButtonText]}>Continue</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default VerificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
    input: {
        height: 60,
        width: 60,

        marginHorizontal: 5,
        backgroundColor: '#1F1F1F',
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
    inputYear: {
        height: 60,
        width: 120,

        marginHorizontal: 5,
        backgroundColor: '#1F1F1F',
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