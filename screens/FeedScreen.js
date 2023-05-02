import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { FlashList } from '@shopify/flash-list';

const FeedScreen = ({ navigation }) => {
  const [postsData, setPostsData] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [lastDocument, setLastDocument] = useState(null);

  const fetchPosts = async () => {
    try {
      const postsRef = firebase.firestore().collection('posts');
      let query = postsRef.orderBy('timestamp', 'desc');
  
      if (lastDocument) {
        query = query.startAfter(lastDocument);
      }
  
      query = query.limit(5);
  
      const postsSnapshot = await query.get();
  
      if (postsSnapshot.empty) {
        setIsFetching(false);
        return;
      }
  
      const newPostsData = [];
  
      for (const doc of postsSnapshot.docs) {
        const postData = doc.data();
        const username = await getUsername(postData.uid);
        const profilePicture = await getProfilePicture(postData.uid);
  
        newPostsData.push({ ...postData, username, profilePicture });
      }
  
      setPostsData(prevPostsData => [...prevPostsData, ...newPostsData]);
      setLastDocument(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
      setIsFetching(false);
    } catch (error) {
      console.log('Error fetching posts:', error);
      setIsFetching(false);
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

  const handleFollowButtonPress = async (user) => {
    const currentUserUid = firebase.auth().currentUser.uid;
    const otherUserUid = user.uid;

    try {
      const userRef = firebase.firestore().collection('users').doc(otherUserUid);

      // Check if the current user is already following the other user
      if (user.followers.includes(currentUserUid)) {
        // If yes, remove the current user's uid from the other user's followers array
        await userRef.update({
          followers: firebase.firestore.FieldValue.arrayRemove(currentUserUid)
        });
      } else {
        // If no, add the current user's uid to the other user's followers array
        await userRef.update({
          followers: firebase.firestore.FieldValue.arrayUnion(currentUserUid)
        });
      }
    } catch (error) {
      console.log('Error updating follow status:', error);
    }
  };


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


  const handleLoadMore = () => {
    setIsLoadingMore(true);
  };

  useEffect(() => {
    // Fetch initial posts data
    fetchPosts();
    fetchLikedPosts();
  }, []);

  useEffect(() => {
    if (isLoadingMore) {
      fetchPosts();
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.cardView}>
        <View style={[styles.topCard, { justifyContent: 'space-between' }]}>
          <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { uid: item.uid })}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={styles.avatar} source={{ uri: item.profilePicture }} />
              <Text style={styles.nickname}>{item.username}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => handleFollowButtonPress(item)}>
              <Ionicons name={'add'} size={27} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Image style={styles.image} source={{ uri: item.imageUrl }} />
        </View>
        <View style={[styles.topCard, { justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => handleLikeButtonPress(item)}>
              <Ionicons
                name={'heart'}
                size={30}
                color={likedPosts.includes(item.postId) ? 'red' : 'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('CommentsScreen', { postId: item.postId })}>
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
    );
  };

  const renderFooter = () => {
    if (!isFetching) return null;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="white" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={postsData}
        keyExtractor={item => item.postId}
        renderItem={renderPostItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        estimatedItemSize={500}
      />
    </SafeAreaView>
  );
};

export default FeedScreen;

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
});
