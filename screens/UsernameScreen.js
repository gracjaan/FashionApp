import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'

const UsernameScreen = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const isDisabled = username.length < 4;
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', justifyContent: 'flex-end', alignContent: 'center' }} >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
      }}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={10}>
          <View>
            <Image
              style={styles.tinyLogo}
              source={require('/Users/gracjanchmielnicki/newApp/assets/end-logo.png')}
            />
          </View>
          <View style={styles.headerContainer}>
            <Text style={[styles.header, { marginTop: 40, }]}>lovely!</Text>
            <Text style={styles.header}>how should we call u?</Text>
            <TextInput
              placeholder="your name"
              placeholderTextColor="#434343"
              onChange={text => setUsername(text)}
              value={username}
              style={styles.input}

            />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                if (!isDisabled) {
                  navigation.navigate('DateInputScreen');
                }
              }}
              style={[styles.button, { backgroundColor: isDisabled ? '#9B9B9B' : 'white' }]}
              disabled={isDisabled}
            >
              <Text style={[styles.buttonText, { color: isDisabled ? '#F5F5F5' : 'black' }]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>

  )
}

export default UsernameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  headerContainer: {
    width: '80%',
    justifyContent: 'center'
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 60,
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
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center'
  },
  button: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'flex-end'
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'right',
    width: '95%',
  },
  disabledButton: {
    backgroundColor: '#9B9B9B',
  },
  disabledButtonText: {
    color: '#F5F5F5',
  },

})