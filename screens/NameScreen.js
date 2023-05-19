import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native'
import React, { useState } from 'react'
import store from '../redux/store'
import ContinueButton from '../comp/ContinueButton'

const NameScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const isDisabled = name.length < 2;

    const handleContinue = () => {
        if (!isDisabled) {
            store.dispatch({ type: 'UPDATE_NAME', payload: name });
            navigation.navigate('UsernameScreen');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                    <View style={{ marginTop: 40, }}>
                        <Text style={styles.description}>hi, let's get started! {"\n"} what's your name? </Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder="your name"
                            placeholderTextColor="#434343"
                            onChangeText={text => setName(text)}
                            value={name}
                            style={styles.inputText}
                            autoFocus={true}
                            keyboardAppearance='dark'
                            autoCapitalize='words'
                            autoCorrect={false}
                            maxLength={30}
                            autoComplete='name'
                        />
                    </View>
                    <View style={styles.buttonView}>
                        <ContinueButton onPress={handleContinue} isDisabled={isDisabled} />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default NameScreen

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
})