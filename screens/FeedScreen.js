import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/postsSlice';
import { Provider } from 'react-redux';

const FeedScreen = () => {
  const dispatch = useDispatch();
  const postsData = useSelector(state => state.posts.postsData);
  const status = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);


  useEffect(() => {
    // Fetch posts data from Redux store
    dispatch(fetchPosts());
  }, []);

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={postsData}
        keyExtractor={item => item.postId}
        renderItem={({ item }) =>
          <View style={styles.cardView}>
            <View style={[styles.topCard, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.avatar} source={{ uri: item.profilePicture }} />
                <Text style={styles.nickname}>{item.username}</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Ionicons name={'add'} size={27} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Image style={styles.image} source={{ uri: item.imageUrl }} />
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