import { View, Text, SafeAreaView, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import store from '../redux/store'

const DateScreen = ({navigation}) => {
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const dayInput = useRef(null)
    const monthInput = useRef(null)
    const yearInput = useRef(null)

    const handleDayInput = (text) => {
        setDay(text)
        if (text.length === 2) {
            monthInput.current.focus()
        }
    };

    const handleMonthinput = (text) => {
        setMonth(text)
        if (text.length === 2) {
            yearInput.current.focus()
        }
    };

    const isDisabled = day.length !== 2 || month.length !== 2 || year.length !== 4;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
                    <View style={{ marginTop: 40, }}>
                        <Text style={styles.description}>nice to meet you! {'\n'} when were u born?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 40, }}>
                        <View style={styles.inputView}>
                            <TextInput
                                maxLength={2}
                                ref={dayInput}
                                placeholder="dd"
                                placeholderTextColor="#434343"
                                onChangeText={handleDayInput}
                                value={day}
                                style={styles.inputText}
                                autoFocus={true}
                                keyboardType='numeric'
                                keyboardAppearance='dark'
                                onKeyPress={({ nativeEvent }) => {
                                    if (day.length === 2 && nativeEvent.key != 'Backspace') {
                                        setMonth(nativeEvent.key);
                                        monthInput.current.focus();
                                    }
                                }}>
                            </TextInput>
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                maxLength={2}
                                ref={monthInput}
                                placeholder="mm"
                                placeholderTextColor="#434343"
                                onChangeText={handleMonthinput}
                                value={month}
                                style={styles.inputText}
                                keyboardType='numeric'
                                keyboardAppearance='dark'
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && month.length === 0) {
                                        dayInput.current.focus();
                                    }
                                    else if (month.length === 2 && nativeEvent.key != 'Backspace') {
                                        setYear(nativeEvent.key);
                                        yearInput.current.focus();
                                    }
                                }}>
                            </TextInput>
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                maxLength={4}
                                ref={yearInput}
                                placeholder="yyyy"
                                placeholderTextColor="#434343"
                                onChangeText={text => setYear(text)}
                                value={year}
                                style={styles.inputText}
                                keyboardType='numeric'
                                keyboardAppearance='dark'
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && year.length === 0) {
                                        monthInput.current.focus();
                                    }
                                }}>
                            </TextInput>
                        </View>
                    </View>
                    <View style={styles.buttonView}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!isDisabled) {
                                    store.dispatch({ type: 'UPDATE_DATE_OF_BIRTH', payload: { day, month, year } })
                                    console.log(store.getState())
                                    navigation.navigate('PhoneScreen');
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

export default DateScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
        width: 100,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#1F1F1F',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
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