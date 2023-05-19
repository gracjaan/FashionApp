import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useState, useRef } from 'react'

const DateInput = ({onDateChanged}) => {

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

    const handleYearInput = (text) => {
        setYear(text);
        console.log(year)
        if (text.length === 4) {
          // Call the callback function with the extracted date
          onDateChanged(`${day}/${month}/${year}`);
        }
      };

    const isDisabled = day.length !== 2 || month.length !== 2 || year.length !== 4;

    return (
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
                    onChangeText={handleYearInput}
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
    );
};

export default DateInput;

const styles = StyleSheet.create({
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
    description: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});