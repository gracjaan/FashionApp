import { View, Text, SafeAreaView, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useRef } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const AddPostScreen = () => {
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [image, setImage] = useState('https://www.shutterstock.com/image-vector/upload-icon-vector-illustration-on-260nw-1909181089.jpg')

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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
        <ScrollView>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.imageView}>
              {isImageSelected ? (
                <Image
                  source={{ uri: image }}
                  style={{ height: '100%', width: '100%', borderRadius: 10 }}
                />
              ) : (
                <>
                  <View style={{alignItems: 'center'}}>
                    <Ionicons name="camera-outline" size={100} color="white" />
                    <Text style={styles.uploadText}>Upload Photo</Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.tt}>
            <View style={styles.inputView}>
              <TextInput
                maxLength={20}
                placeholder="Add title"
                placeholderTextColor="#434343"
                onChangeText={text => setTitle(text)}
                value={title}
                style={styles.inputText}
                keyboardAppearance='dark'
              />
            </View>
          </View>
          <View style={styles.tt}>
            <View style={styles.inputView}>
              <TextInput
                maxLength={20}
                placeholder="Add tags"
                placeholderTextColor="#434343"
                onChangeText={text => setTags(text)}
                value={tags}
                style={styles.inputText}
                keyboardAppearance='dark'
              />
            </View>
          </View>
          <View style={styles.tt}>
            <View style={styles.descriptionView}>
              <TextInput
                multiline
                placeholder="Add description"
                placeholderTextColor="#434343"
                onChangeText={text => setDescription(text)}
                value={description}
                style={styles.inputText}
                keyboardAppearance='dark'
              />
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
        </ScrollView>
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
    borderWidth: 2,
    borderColor: 'white',
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
    alignSelf: 'center'
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
})