import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Ionicons } from '@expo/vector-icons';
import 'firebase/compat/firestore';
import 'firebase/auth';
import { Image } from 'expo-image';
import PostItem from '../comp/PostItem';


const FeedScreen = ({ navigation }) => {
  const [postsData, setPostsData] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [inspoPosts, setInspoPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDocument, setLastDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeButtonPress = async (post) => {
    try {
      const currentUserUid = firebase.auth().currentUser.uid;

      if (likedPosts.includes(post.postId)) {
        // If post is already liked, remove the like
        await firebase.firestore().collection('posts').doc(post.postId).update({
          likes: firebase.firestore.FieldValue.arrayRemove(currentUserUid)
        });

        setLikedPosts(likedPosts.filter(postId => postId !== post.postId));
      } else {
        // If post is not liked, add the like
        await firebase.firestore().collection('posts').doc(post.postId).update({
          likes: firebase.firestore.FieldValue.arrayUnion(currentUserUid)
        });

        setLikedPosts([...likedPosts, post.postId]);
      }
    } catch (error) {
      console.log('Error updating like status:', error);
    }
  };

  const handleInspoButtonPress = async (post) => {
    try {
      const currentUserUid = firebase.auth().currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(currentUserUid);
      const userSnapshot = await userRef.get();
      const inspoArray = userSnapshot.data().inspo;

      if (inspoArray.includes(post.postId)) {
        // If post is already liked, remove the like
        await userRef.update({
          inspo: firebase.firestore.FieldValue.arrayRemove(post.postId)
        });

        setInspoPosts(inspoPosts.filter(postId => postId !== post.postId));
      } else {
        // If post is not liked, add the like
        await userRef.update({
          inspo: firebase.firestore.FieldValue.arrayUnion(post.postId)
        });
        setInspoPosts([...inspoPosts, post.postId]);
      }
    } catch (error) {
      console.log('Error updating inspo status:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const postsRef = firebase.firestore().collection('posts');
      let query = postsRef.orderBy('timestamp', 'desc');

      if (lastDocument) {
        console.log('lastDocument exists');
        query = query.startAfter(lastDocument);
      }

      query = query.limit(5);

      const postsSnapshot = await query.get();

      if (postsSnapshot.empty) {
        setIsLoading(false);
        return;
      }

      const newPostsData = [];

      for (const doc of postsSnapshot.docs) {
        const postData = doc.data();
        const username = await getUsername(postData.uid);
        const profilePicture = await getProfilePicture(postData.uid);

        newPostsData.push({ ...postData, username, profilePicture, key: doc.id });
      }

      let first = 0;
      let second = 0;

      setPostsData(prevPostsData => {
        const uniquePosts = [...prevPostsData];
        newPostsData.forEach(newPost => {
          first += 1;
          if (!uniquePosts.some(post => post.key === newPost.key)) {
            uniquePosts.push(newPost);
            second += 1;
          }
        });
        return uniquePosts;
      });
      console.log('first:', first);
      console.log('second:', second);

      setLastDocument(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
      fetchLikedPosts();
      fetchInspo();
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching posts:', error);
      setIsLoading(false);
    }
  };


  const getUsername = async (uid) => {
    try {
      const userSnapshot = await firebase.firestore().collection('users').doc(uid).get();
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        return userData.username;
      }
      return '';
    } catch (error) {
      console.log('Error fetching username:', error);
      return '';
    }
  };

  const getProfilePicture = async (uid) => {
    try {
      const userSnapshot = await firebase.firestore().collection('users').doc(uid).get();
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        return userData.profilePicture;
      }
      return '';
    } catch (error) {
      console.log('Error fetching profile picture:', error);
      return '';
    }
  };



  const fetchLikedPosts = async () => {
    try {
      const currentUserUid = firebase.auth().currentUser.uid;
      const snapshot = await firebase.firestore().collection('posts').where('likes', 'array-contains', currentUserUid).get();
      const likedPostIds = snapshot.docs.map(doc => doc.id);
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.log('Error fetching liked posts:', error);
    }
  };

  const fetchInspo = async () => {
    try {
      const currentUserUid = firebase.auth().currentUser.uid;
      const snapshot = (await firebase.firestore().collection('users').doc(currentUserUid).get()).data().inspo;
      setInspoPosts(snapshot);
    } catch (error) {
      console.log('Error fetching liked posts:', error);
    }
  };


  const renderItem = ({ item }) => {
    return (
      <PostItem
        item={item}
        likedPosts={likedPosts}
        inspoPosts={inspoPosts}
        handleLikeButtonPress={handleLikeButtonPress}
        handleInspoButtonPress={handleInspoButtonPress}
        navigation={navigation}
      />
    );
  };

  const renderLoader = () => {
    return (
      isLoading ?
        <View style={styles.loaderStyle}>
          <ActivityIndicator size="large" color="#aaa" />
        </View> : null
    );
  };

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    // Fetch initial posts data
    fetchPosts();
  }, [currentPage]);


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={postsData}
        keyExtractor={item => item.postId}
        renderItem={renderItem}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
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
    aspectRatio: 1,
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
    marginBottom: 20,
    width: '100%',
    alignSelf: 'center',
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
    fontSize: 15,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 10,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: "center",
  },
  date: {
    color: 'grey',
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'regular',
    //textAlign: 'center',
  },
  description: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Helvetica',
    fontWeight: 'regular',
    //textAlign: 'center',
  }
})
