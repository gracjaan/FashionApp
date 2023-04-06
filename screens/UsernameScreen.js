import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import store from '../redux/store'

const UsernameScreen = ({navigation}) => {
    const [username, setUsername] = useState('')
    const isDisabled = username.length < 4;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                    <View style={{ marginTop: 40, }}>
                        <Text style={styles.description}>lovely! {"\n"} how should we call u? </Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder="your username"
                            placeholderTextColor="#434343"
                            onChangeText={text => setUsername(text)}
                            value={username}
                            style={styles.inputText}
                            autoFocus={true}
                            keyboardAppearance='dark'
                        />
                    </View>
                    <View style={styles.buttonView}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!isDisabled) {
                                    store.dispatch({ type: 'UPDATE_USERNAME', payload: username })
                                    console.log(store.getState())
                                    navigation.navigate('DateScreen');
                                }
                            }}
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

export default UsernameScreen

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
})