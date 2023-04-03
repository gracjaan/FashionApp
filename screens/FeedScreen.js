import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const FeedScreen = () => {
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOverScrollRefreshing, setIsOverScrollRefreshing] = useState(false);


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

  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      setIsOverScrollRefreshing(false);

      // Fetch the images from the database and update the state here
      const storageRef = firebase.storage().ref();
      storageRef
        .child('images')
        .listAll()
        .then(function (result) {
          const promises = result.items.map(function (imageRef) {
            return imageRef.getDownloadURL();
          });
          Promise.all(promises).then(function (urls) {
            setImages(urls.map(url => ({ url })));
            setRefreshing(false);
            setIsOverScrollRefreshing(false); // Add this line to hide the loading icon
          });
        });
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y <= -100) {
            setIsOverScrollRefreshing(true);
            handleRefresh();
          }
        }}
        ListHeaderComponent={
          isOverScrollRefreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          ) : null
        }
        renderItem={({ item }) =>
          <View style={styles.cardView}>
            <View style={[styles.topCard, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image style={styles.avatar} source={require('/Users/gracjanchmielnicki/newApp/assets/default-user-image.png')} />
                  <Text style={styles.nickname}>gracjanchmielnicki</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Ionicons name={'add'} size={27} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Image style={styles.image} source={{ uri: item.url }} />
            </View>
            <View style={[styles.topCard, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <Ionicons name={'heart'} size={30} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <Ionicons name={'chatbubble'} size={27} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <Ionicons name={'paper-plane'} size={27} color={'white'} />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity>
                  <Ionicons name={'shirt'} size={27} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </SafeAreaView >
  )
}


export default FeedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  image: {
    width: '98%',
    height: 400,
    resizeMode: 'cover',
    borderRadius: 10,
    alignSelf: 'center'
  },
  avatar: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    borderRadius: 100
  },
  cardView: {
    marginBottom: 40,
    width: '100%',
    height: 530,
    //borderRadius: 20,
    //borderWidth: 2,
    //borderColor: '#434343',
    //backgroundColor: '#1F1F1F',
    //justifyContent: 'center',
    alignSelf: 'center',
    //alignItems: 'center',
    //padding: 10
  },
  topCard: {
    flexDirection: 'row',
    margin: 15,
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  nickname: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 10,
  },
})