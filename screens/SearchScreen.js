import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const SearchScreen = () => {
  const [search, setSearch] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <View style={{ flex: 1, }}>
          <View style={styles.searchView}>
            <View style={styles.inputView}>
              <TextInput
                maxLength={24}
                placeholder="Search"
                placeholderTextColor="#434343"
                onChangeText={text => setSearch(text)}
                value={search}
                style={styles.inputText}
                keyboardAppearance='dark'
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.continue}
              >
                <Ionicons name={'arrow-forward'} size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  searchView: {
    height: 60,
    marginTop: 60,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#434343',
    borderWidth: 2,
    justifyContent: 'center',
  },
  continue: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 15
  },
  inputView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    color: 'white',
  },
  inputText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
})