import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';

const SearchScreen = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);

  const searchUsers = async () => {
    try {
      const snapshot = await firebase.firestore().collection('users').where('username', '>=', search).get();
      const userData = snapshot.docs.map(doc => doc.data());
      setUsers(userData);
    } catch (error) {
      console.log('Error searching users:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <View style={{ flex: 1 }}>
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
            <TouchableOpacity
              style={styles.continue}
              onPress={searchUsers} // Call searchUsers function on button press
            >
              <Ionicons name={'arrow-forward'} size={30} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={users}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                {item.profilePicture && (
                  <Image source={{ uri: item.profilePicture }} style={styles.avatar} /> // Render avatar if available
                )}
                <Text style={styles.username}>{item.username}</Text>
              </View>
            )}
          />
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
    height: 50,
    marginTop: 20,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#1F1F1F',
    paddingLeft: 15,
    paddingRight: 6,
    //paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#434343',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
  avatar: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    borderRadius: 100,
    marginRight: 10
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Helvetica',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#434343',
    marginTop: 10,
  },
})