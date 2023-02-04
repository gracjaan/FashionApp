import { StyleSheet, Image, View, TextInput, SafeAreaView, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

const DateInputScreen = ({ navigation, route }) => {
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const dayInput = useRef(null)

    useEffect(() => {
        dayInput.current.focus();
    }, []);
    
    const monthInput = useRef(null)
    const yearInput = useRef(null)

    const handleDayChange = (text) => {
        setDay(text)
        if (text.length === 2) {
            monthInput.current.focus()
        }
    }

    const handleMonthChange = (text) => {
        setMonth(text)
        if (text.length === 2) {
            yearInput.current.focus()
        }
    }

    const handlePress = () => {
        if (day.length === 2 && month.length === 2 && year.length === 4) {
            navigation.navigate('PhoneNumberScreen')
        } else {
            alert('Please enter a valid date')
        }
    }

    const isDisabled = day.length !== 2 || month.length !== 2 || year.length !== 4;

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
                        nice to meet you! {'\n'}
                        when were u born?
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '90%', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                    <View>
                        <TextInput
                            ref={dayInput}
                            style={styles.input}
                            onChangeText={handleDayChange}
                            value={day}
                            placeholder="dd"
                            maxLength={2}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View>
                        <TextInput
                            ref={monthInput}
                            style={styles.input}
                            onChangeText={handleMonthChange}
                            value={month}
                            placeholder="mm"
                            maxLength={2}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View>
                        <TextInput
                            ref={yearInput}
                            style={styles.inputYear}
                            onChangeText={text => setYear(text)}
                            value={year}
                            placeholder="yyyy"
                            maxLength={4}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', width: '95%', alignSelf: 'center' }} behavior='padding' keyboardVerticalOffset={10}>
                <TouchableOpacity
                    onPress={handlePress}
                    style={[styles.button, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                >
                    <Text style={[styles.buttonText, isDisabled && styles.disabledButtonText]}>Continue</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default DateInputScreen;

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
    input: {
        //width: '80%',
        height: 60,
        width: 80,

        marginHorizontal: 5,
        backgroundColor: '#1F1F1F',
        //paddingHorizontal: 15,
        //paddingVertical: 10,
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
        //width: '80%',
        height: 60,
        width: 120,

        marginHorizontal: 5,
        backgroundColor: '#1F1F1F',
        //paddingHorizontal: 15,
        //paddingVertical: 10,
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