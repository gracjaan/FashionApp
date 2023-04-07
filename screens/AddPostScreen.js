import { View, Text, SafeAreaView, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useRef } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const AddPostScreen = () => {
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [image, setImage] = useState('https://www.shutterstock.com/image-vector/upload-icon-vector-illustration-on-260nw-1909181089.jpg')
  const [des, setDes] = useState('')
  const [top, setTop] = useState('')
  const [bottom, setBottom] = useState('')

  const storageRef = firebase.storage().ref();

  const uploadImageToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = Date.now().toString(); // Use a unique filename
    const imageRef = storageRef.child(`images/${filename}`);

    try {
      await imageRef.put(blob);
      const downloadUrl = await imageRef.getDownloadURL();
      console.log(`Image uploaded to Firebase: ${downloadUrl}`);

      // Generate a postId
      const postId = firebase.firestore().collection('posts').doc().id;

      // Add relevant data to Firestore database
      await firebase.firestore().collection('posts').doc(postId).set({
        postId: postId, // Use the generated postId
        uid: firebase.auth().currentUser.uid, // Replace with the user ID
        description: description, // Replace with the description state value
        toplink: top, // Replace with the top state value
        bottomlink: bottom, // Replace with the bottom state value
        likes: 0, // Initial likes value
        comments: [], // Empty array for comments
        imageUrl: downloadUrl, // URL of the uploaded image
      });

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      return null;
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setIsImageSelected(true);
    }
  };

  const onPostButtonPress = async () => {
    if (image) {
      await uploadImageToFirebase(image);
    } else {
      console.log('No image selected');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imageView}>
            {isImageSelected ? (
              <Image
                source={{ uri: image }}
                style={{ height: '100%', width: '100%', borderRadius: 10 }}
              />
            ) : (
              <>
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="camera-outline" size={100} color="white" />
                  <Text style={styles.uploadText}>Upload Photo</Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
        <View style={{ height: 100, marginTop: 50 }}>
          <View style={{ flexDirection: 'row', flex: 1, marginLeft: 15, alignItems: 'center', alignContent: 'center', }}>
            <View style={{ flexBasis: 150 }}>
              <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'left', }}>Top</Text>
            </View>
            <View styel={{ alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <TextInput
                style={styles.secondColumn}
                onChangeText={text => setTop(text)}
                value={top}
                placeholder="www.example.com"
                placeholderTextColor={'grey'}
                keyboardAppearance='dark'
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginLeft: 15, alignItems: 'center', alignContent: 'center', }}>
            <View style={{ flexBasis: 150 }}>
              <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'left', }}>Bottom</Text>
            </View>
            <View styel={{ alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <TextInput
                style={styles.secondColumn}
                onChangeText={text => setBottom(text)}
                value={bottom}
                placeholder="www.example.com"
                placeholderTextColor={'grey'}
                keyboardAppearance='dark'
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginLeft: 15, alignItems: 'center', alignContent: 'center', }}>
            <View style={{ flexBasis: 150 }}>
              <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'left', }}>Description</Text>
            </View>
            <View styel={{ alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <TextInput
                style={styles.secondColumn}
                onChangeText={text => setDes(text)}
                value={des}
                placeholder="Description"
                placeholderTextColor={'grey'}
                keyboardAppearance='dark'
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={onPostButtonPress}
            style={styles.continue}
          >
            <Text style={styles.description}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AddPostScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  imageView: {
    marginTop: 20,
    height: 350,
    width: 350,
    //borderWidth: 2,
    //borderColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center'
  },
  description: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputView: {
    height: 60,
    width: 350,
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
  descriptionView: {
    height: 160,
    width: 350,
    //justifyContent: 'center',
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
  },
  tt: {
    marginTop: 20,
    width: '95%',
    alignSelf: 'center'
  },
  buttonView: {
    marginTop: 20,
    marginBottom: 20,
    width: 350,
    alignSelf: 'center',
  },
  continue: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'white',

  },
  uploadText: {
    color: '#A9A9A9',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },
  secondColumn: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  }
})