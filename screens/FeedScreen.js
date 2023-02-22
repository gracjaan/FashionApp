import { View, Text, SafeAreaView, StyleSheet, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const FeedScreen = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Initialize Firebase Storage
    const storageRef = firebase.storage().ref();

    // Get a list of all images in the "images" folder
    storageRef.child('images').listAll().then(function (result) {
      result.items.forEach(function (imageRef) {
        // Get the download URL for each image and add it to the images state
        imageRef.getDownloadURL().then(function (url) {
          setImages(images => [...images, { url }]);
        });
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image style={styles.image} source={{ uri: item.url }} />}
      />
    </SafeAreaView>
  )
}


export default FeedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  }
})